// ============================================
// Promoo Backend — Subscription Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import { stripeService } from './stripe.service';

export class SubscriptionService {
  /**
   * Get all active subscription plans
   */
  async getPlans() {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw ApiError.internal(error.message);
    }
    return data;
  }

  /**
   * Get an active plan by ID
   */
  async getPlanById(planId: string) {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw ApiError.notFound('Plan not found or inactive');
    }
    return data;
  }

  /**
   * Create a Subscription Checkout Session
   */
  async createSubscriptionCheckout(userId: string, planId: string, returnUrl: string) {
    // 1. Get Plan details (to get Stripe Price ID)
    const plan = await this.getPlanById(planId);
    
    if (!plan.stripe_price_id) {
      throw ApiError.internal('Plan does not have a linked Stripe price');
    }

    // 2. Get or create Stripe Customer for the user
    const customerId = await stripeService.getOrCreateCustomer(userId);

    // 3. Check if user already has an active subscription
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('status')
      .eq('profile_id', userId)
      .in('status', ['active', 'trialing'])
      .maybeSingle();

    if (existingSub) {
      throw ApiError.badRequest('You already have an active subscription');
    }

    // 4. Create Stripe Checkout Session
    const session = await stripeService.createSubscriptionCheckout(
      customerId,
      plan.stripe_price_id,
      `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      `${returnUrl}?canceled=true`
    );

    return { url: session.url };
  }

  /**
   * Get the current user's active subscription
   */
  async getMySubscription(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw ApiError.internal(error.message);
    }
    return data;
  }

  /**
   * Cancel Subscription (creates a customer portal session to manage it)
   */
  async getCustomerPortalUrl(userId: string, returnUrl: string) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!profile || !profile.stripe_customer_id) {
      throw ApiError.badRequest('No billing account found');
    }

    const session = await stripeService.createPortalSession(profile.stripe_customer_id, returnUrl);
    
    return { url: session.url };
  }

  /**
   * Handle Stripe Webhook to sync subscription data
   */
  async handleStripeWebhook(event: any) {
    // Handling logic will be processed here (e.g., checkout.session.completed, customer.subscription.created/updated/deleted)
    const type = event.type;
    const data = event.data.object;

    if (type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // We only process one-time payments here. Subscriptions are handled by invoice.payment_succeeded
      if (session.mode === 'payment') {
        const stripePaymentId = session.id;
        
        // Idempotency check: does this payment already exist?
        const { data: existingPayment } = await supabaseAdmin
          .from('payments')
          .select('id')
          .eq('stripe_payment_id', stripePaymentId)
          .maybeSingle();

        if (!existingPayment) {
          const profileId = session.metadata?.profileId;
          const amount = session.amount_total / 100;
          const paymentType = session.metadata?.type || 'ad';

          if (profileId) {
            // Insert payment
            await supabaseAdmin.from('payments').insert({
              profile_id: profileId,
              stripe_payment_id: stripePaymentId,
              amount: amount,
              type: paymentType,
              status: 'succeeded',
              metadata: session.metadata || {}
            });

            // Activate Featured Account if applicable
            if (paymentType === 'featured') {
              const placement = session.metadata?.placement;
              const durationDays = parseInt(session.metadata?.durationDays || '0', 10);
              
              if (placement && durationDays > 0) {
                const startDate = new Date();
                const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
                
                await supabaseAdmin.from('featured_accounts').insert({
                  profile_id: profileId,
                  placement: placement,
                  start_date: startDate.toISOString(),
                  end_date: endDate.toISOString(),
                  amount_paid: amount,
                  is_active: true
                });
              }
            }
          }
        }
      }
    } else if (type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const stripePaymentId = invoice.id;

      // Idempotency check
      const { data: existingPayment } = await supabaseAdmin
        .from('payments')
        .select('id')
        .eq('stripe_payment_id', stripePaymentId)
        .maybeSingle();

      if (!existingPayment) {
        // Find profile by customer
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', invoice.customer)
          .single();

        if (profile && invoice.amount_paid > 0) {
          await supabaseAdmin.from('payments').insert({
            profile_id: profile.id,
            stripe_payment_id: stripePaymentId,
            amount: invoice.amount_paid / 100,
            type: 'subscription',
            status: 'succeeded',
            metadata: {
              invoice_url: invoice.hosted_invoice_url,
              subscription_id: invoice.subscription
            }
          });
        }
      }
    } else if (type === 'customer.subscription.created' || type === 'customer.subscription.updated') {
      const customerId = data.customer;
      const stripeSubId = data.id;
      const status = data.status; // e.g., 'active', 'past_due', 'canceled'
      const currentPeriodStart = new Date(data.current_period_start * 1000).toISOString();
      const currentPeriodEnd = new Date(data.current_period_end * 1000).toISOString();
      const cancelAt = data.canceled_at ? new Date(data.canceled_at * 1000).toISOString() : null;
      const priceId = data.items.data[0].price.id;

      // 1. Find profile by stripe_customer_id
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (!profile) return; // User not found, ignore

      // 2. Find plan by stripe_price_id
      const { data: plan } = await supabaseAdmin
        .from('subscription_plans')
        .select('id')
        .eq('stripe_price_id', priceId)
        .single();

      if (!plan) return; // Plan not found, ignore

      // 3. Upsert Subscription
      const payload = {
        profile_id: profile.id,
        plan_id: plan.id,
        stripe_subscription_id: stripeSubId,
        status: status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        canceled_at: cancelAt,
      };

      // We need to check if it exists first because we only UPSERT by stripe_subscription_id
      const { data: existingSub } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('stripe_subscription_id', stripeSubId)
        .maybeSingle();

      if (existingSub) {
        await supabaseAdmin
          .from('subscriptions')
          .update(payload)
          .eq('id', existingSub.id);
      } else {
        await supabaseAdmin
          .from('subscriptions')
          .insert(payload);
      }
    } else if (type === 'customer.subscription.deleted') {
      const stripeSubId = data.id;
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'canceled', canceled_at: new Date().toISOString() })
        .eq('stripe_subscription_id', stripeSubId);
    }
  }
}

export const subscriptionService = new SubscriptionService();
