// ============================================
// Promoo Backend — Stripe Service
// ============================================

import { stripe } from '../config/stripe';

import { ApiError } from '../utils/apiError';
import { supabaseAdmin } from '../config/supabase';

export class StripeService {
  /**
   * Get or create a Stripe Customer for a user profile
   */
  async getOrCreateCustomer(profileId: string, email?: string, name?: string): Promise<string> {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', profileId)
      .single();

    if (!profile) {
      throw ApiError.notFound('Profile not found');
    }

    if (profile.stripe_customer_id) {
      return profile.stripe_customer_id;
    }

    // Create a new Stripe Customer
    const customerEmail = profile.email || email;
    const customerName = profile.full_name || name;

    if (!customerEmail) {
      throw ApiError.badRequest('Email is required to create a Stripe customer');
    }

    const customer = await stripe.customers.create({
      email: customerEmail,
      name: customerName,
      metadata: { profile_id: profileId },
    });

    // Save customer ID in profile
    await supabaseAdmin
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', profileId);

    return customer.id;
  }

  /**
   * Create a Checkout Session for a subscription
   */
  // async createSubscriptionCheckout(
  //   customerId: string,
  //   priceId: string,
  //   successUrl: string,
  //   cancelUrl: string
  // ) {
  //   const session = await stripe.checkout.sessions.create({
  //     customer: customerId,
  //     mode: 'subscription',
  //     payment_method_types: ['card'],
  //     line_items: [
  //       {
  //         price: priceId,
  //         quantity: 1,
  //       },
  //     ],
  //     success_url: successUrl,
  //     cancel_url: cancelUrl,
  //     subscription_data: {
  //       metadata: {
  //         price_id: priceId,
  //       },
  //     },
  //   });

  //   return session;
  // }

  /**
   * Create a Subscription with Payment Intent for Mobile (PaymentSheet)
   */
  async createMobileSubscription(customerId: string, priceId: string) {
    if (priceId.includes('placeholder')) {
      throw ApiError.badRequest('This plan uses a placeholder Stripe Price ID. Please update the database with real Stripe Price IDs.');
    }
    // 1. Create an Ephemeral Key for the Customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2023-10-16' } // Typically you want to use your current Stripe API version
    );

    // 2. Create the Subscription with default_incomplete payment behavior
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        price_id: priceId,
      },
    });

    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice.payment_intent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customerId: customerId,
    };
  }

  /**
   * Create a Customer Portal session
   */
  async createPortalSession(customerId: string, returnUrl: string) {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  }
}

export const stripeService = new StripeService();
