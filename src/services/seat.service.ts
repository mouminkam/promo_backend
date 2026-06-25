// ============================================
// Promoo Backend — Seat Service
// ============================================

import { supabaseAdmin, createSupabaseClient } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any,
});

export class SeatService {
  async getSeats(tier?: string) {
    let query = supabaseAdmin
      .from('seats')
      .select('*, profile:profiles(id, full_name, username, avatar_url, category_id)')
      .order('position', { ascending: true });

    if (tier) {
      query = query.eq('tier', tier);
    }

    const { data, error } = await query;

    if (error) {
      throw ApiError.internal(error.message);
    }

    // Release pending seats older than 15 minutes
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000);

    const releasedSeats = data.map((seat: any) => {
      if (seat.status === 'pending') {
        const updatedAt = new Date(seat.updated_at);
        if (updatedAt < fifteenMinutesAgo) {
          // Asynchronously release the seat in the DB
          supabaseAdmin
            .from('seats')
            .update({ status: 'available', influencer_id: null, expires_at: null })
            .eq('id', seat.id)
            .then(() => {});
            
          return { ...seat, status: 'available', influencer_id: null };
        }
      }
      return seat;
    });

    return releasedSeats;
  }

  async getMySeats(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('seats')
      .select('*')
      .eq('influencer_id', userId);

    if (error) {
      throw ApiError.internal(error.message);
    }

    return data;
  }

  async bookSeat(seatId: string, userId: string) {
    const { data: seat, error: seatError } = await supabaseAdmin
      .from('seats')
      .select('*')
      .eq('id', seatId)
      .single();

    if (seatError || !seat) {
      throw ApiError.notFound('Seat not found');
    }

    // Treat pending seats older than 15 minutes as available
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000);
    const isExpiredPending = seat.status === 'pending' && new Date(seat.updated_at) < fifteenMinutesAgo;

    if ((seat.status === 'booked' || seat.status === 'pending') && !isExpiredPending && seat.influencer_id) {
      throw ApiError.badRequest('This seat is already booked or pending payment');
    }

    // Instantly reserve the seat to prevent race conditions
    await supabaseAdmin
      .from('seats')
      .update({ status: 'pending', influencer_id: userId, updated_at: new Date().toISOString() })
      .eq('id', seatId);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: `Promoo ${seat.tier} Seat Booking (Position ${seat.position})`,
            },
            unit_amount: seat.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CORS_ORIGINS?.split(',')[0] || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_ORIGINS?.split(',')[0] || 'http://localhost:3000'}/payment/cancel`,
      metadata: {
        type: 'seat_booking',
        seatId: seatId,
        userId: userId,
        profileId: userId,
        duration_days: '30',
      },
    });

    return { checkoutUrl: session.url, sessionId: session.id, paymentId: session.payment_intent || null, status: 'pending' };
  }

  async cancelSeat(seatId: string, userId: string, token: string) {
    const supabase = createSupabaseClient(token);

    const { data: existing, error: existError } = await supabaseAdmin
      .from('seats')
      .select('influencer_id')
      .eq('id', seatId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Seat not found');
    }

    if (existing.influencer_id !== userId) {
      throw ApiError.forbidden('You do not have permission to cancel this seat');
    }

    const { data, error } = await supabase
      .from('seats')
      .update({
        status: 'available',
        influencer_id: null,
        expires_at: null,
      })
      .eq('id', seatId)
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  /**
   * Handle Stripe Webhook for seat booking
   */
  async handleStripeWebhook(session: any) {
    if (session.payment_status === 'paid') {
      const seatId = session.metadata?.seatId;
      const userId = session.metadata?.userId;

      if (seatId && userId) {
        // Find existing seat
        const { data: seat } = await supabaseAdmin
          .from('seats')
          .select('id, status')
          .eq('id', seatId)
          .single();

        if (seat && seat.status !== 'booked') {
          const durationDays = parseInt(session.metadata?.duration_days || '30', 10);
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + durationDays);

          await supabaseAdmin
            .from('seats')
            .update({
              status: 'booked',
              influencer_id: userId,
              expires_at: expiresAt.toISOString(),
            })
            .eq('id', seatId);
        }
      }
    }
  }
}

export const seatService = new SeatService();
