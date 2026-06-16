// ============================================
// Promoo Backend — Payment Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import { stripe } from '../config/stripe';
import { env } from '../config/env';

export class PaymentService {
  /**
   * Get payment history for a user
   */
  async getMyPayments(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const { count } = await supabaseAdmin
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId);

    const total = count || 0;

    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw ApiError.internal(error.message);
    }

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get specific payment details
   */
  async getPaymentDetails(userId: string, paymentId: string) {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('profile_id', userId)
      .single();

    if (error || !data) {
      throw ApiError.notFound('Payment not found');
    }

    return data;
  }

  /**
   * Create Stripe Customer Portal session
   */
  async createCustomerPortalSession(userId: string) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!profile?.stripe_customer_id) {
      throw ApiError.badRequest('No billing account found. Please make a payment first.');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${env.CLIENT_URL}/settings/billing`,
    });

    return { url: session.url };
  }
}

export const paymentService = new PaymentService();
