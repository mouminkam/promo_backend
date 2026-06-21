// ============================================
// Promoo Backend — Featured Service
// ============================================

import { stripe } from '../config/stripe';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';
import { ApiError } from '../utils/apiError';

export class FeaturedService {
  private readonly PRICE_PER_DAY = 1.50; // $1.50 per day for featured placement

  /**
   * Request featured status by creating a Stripe Checkout session
   */
  async requestFeatured(userId: string, placement: string, duration_days: number) {
    // Check if user already has an active featured account for this placement
    const { data: existing } = await supabaseAdmin
      .from('featured_accounts')
      .select('id')
      .eq('profile_id', userId)
      .eq('placement', placement)
      .eq('is_active', true)
      .maybeSingle();

    if (existing) {
      throw ApiError.badRequest('You already have an active featured placement of this type');
    }

    // Get user email
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer if doesn't exist
      // We don't have email in profiles directly, but Stripe customer might need it.
      // We can just create customer with name and metadata.
      const customer = await stripe.customers.create({
        name: profile?.full_name || 'Promoo User',
        metadata: { profileId: userId },
      });
      customerId = customer.id;

      await supabaseAdmin
         .from('profiles')
         .update({ stripe_customer_id: customerId })
         .eq('id', userId);
    }

    const totalAmount = this.PRICE_PER_DAY * duration_days;

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Featured Placement - ${placement.charAt(0).toUpperCase() + placement.slice(1)}`,
              description: `Featured placement for ${duration_days} days`,
            },
            unit_amount: Math.round(totalAmount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment, not subscription
      success_url: `${env.CLIENT_URL}/featured/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.CLIENT_URL}/featured/cancel`,
      metadata: {
        type: 'featured',
        profileId: userId,
        placement,
        duration_days: duration_days.toString(),
      },
    });

    return { url: session.url };
  }

  /**
   * Get currently active featured listings
   */
  async getFeaturedListings(placement?: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('featured_accounts')
      .select('*, profile:profiles!profile_id(id, full_name, username, avatar_url, bio, account_type)', { count: 'exact' })
      .eq('is_active', true);
      // RLS already filters to "now() between start_date and end_date" for public reads

    if (placement) {
      query = query.eq('placement', placement);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw ApiError.internal(error.message);
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }
}

export const featuredService = new FeaturedService();
