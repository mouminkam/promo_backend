// ============================================
// Promoo Backend — Offer Service
// ============================================

import { supabaseAdmin, createSupabaseClient } from '../config/supabase';
import { ApiError } from '../utils/apiError';

export class OfferService {
  /**
   * Create a new offer
   */
  async createOffer(userId: string, token: string, payload: any) {
    const supabase = createSupabaseClient(token);

    // Verify category exists
    const { data: category, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('id', payload.category_id)
      .single();

    if (catError || !category) {
      throw ApiError.badRequest('Invalid category ID');
    }

    // Insert offer
    const { data, error } = await supabase
      .from('offers')
      .insert({
        profile_id: userId,
        category_id: payload.category_id,
        title: payload.title,
        description: payload.description,
        original_price: payload.original_price,
        offer_price: payload.offer_price,
        discount_percentage: payload.discount_percentage,
        media_urls: payload.media_urls || [],
        start_date: payload.start_date,
        end_date: payload.end_date,
        status: payload.status || 'active',
      })
      .select('*, category:categories(id, name_ar, name_en, slug)')
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  /**
   * Update an existing offer
   */
  async updateOffer(offerId: string, userId: string, token: string, payload: any) {
    const supabase = createSupabaseClient(token);

    // Verify offer existence and ownership
    const { data: existing, error: existError } = await supabaseAdmin
      .from('offers')
      .select('profile_id')
      .eq('id', offerId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Offer not found');
    }

    if (existing.profile_id !== userId) {
      throw ApiError.forbidden('You do not have permission to update this offer');
    }

    if (payload.category_id) {
      const { data: category, error: catError } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('id', payload.category_id)
        .single();

      if (catError || !category) {
        throw ApiError.badRequest('Invalid category ID');
      }
    }

    const { data, error } = await supabase
      .from('offers')
      .update(payload)
      .eq('id', offerId)
      .select('*, category:categories(id, name_ar, name_en, slug)')
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  /**
   * Delete an offer
   */
  async deleteOffer(offerId: string, userId: string, token: string) {
    const supabase = createSupabaseClient(token);

    const { data: existing, error: existError } = await supabaseAdmin
      .from('offers')
      .select('profile_id')
      .eq('id', offerId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Offer not found');
    }

    if (existing.profile_id !== userId) {
      throw ApiError.forbidden('You do not have permission to delete this offer');
    }

    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', offerId);

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return true;
  }

  /**
   * Get an offer by ID (increments view count)
   */
  async getOfferById(offerId: string, requestingUserId?: string) {
    const { data, error } = await supabaseAdmin
      .from('offers')
      .select('*, profile:profiles(id, full_name, username, avatar_url, location), category:categories(id, name_ar, name_en, slug)')
      .eq('id', offerId)
      .single();

    if (error || !data) {
      throw ApiError.notFound('Offer not found');
    }

    // RLS-like logic for drafts/rejected/expired offers
    if (data.status !== 'active' && data.profile_id !== requestingUserId) {
      throw ApiError.forbidden('You do not have permission to view this offer');
    }

    // Increment view count asynchronously in the background
    supabaseAdmin
      .from('offers')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', offerId)
      .then(({ error: viewErr }) => {
        if (viewErr) console.error('Error incrementing view count:', viewErr.message);
      });

    return data;
  }

  /**
   * List offers with filtering & pagination (active offers only)
   */
  async getOffers(filters: {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    location?: string;
    search?: string;
    page: number;
    limit: number;
  }) {
    const { category_id, min_price, max_price, location, search, page, limit } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from('offers')
      .select('*, profile:profiles!inner(id, full_name, username, avatar_url, location), category:categories(id, name_ar, name_en, slug)', { count: 'exact' })
      .eq('status', 'active');

    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    if (min_price !== undefined) {
      query = query.gte('offer_price', min_price);
    }
    if (max_price !== undefined) {
      query = query.lte('offer_price', max_price);
    }
    if (location) {
      query = query.ilike('profile.location', `%${location}%`);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .range(from, to)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw ApiError.internal(error.message);
    }

    return { data, count: count || 0 };
  }

  /**
   * Get offers created by a specific user profile
   */
  async getOffersByProfileId(profileId: string, page: number, limit: number, requestingUserId?: string) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from('offers')
      .select('*, category:categories(id, name_ar, name_en, slug)', { count: 'exact' })
      .eq('profile_id', profileId);

    // If requester is not the owner, only show active offers
    if (profileId !== requestingUserId) {
      query = query.eq('status', 'active');
    }

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw ApiError.internal(error.message);
    }

    return { data, count: count || 0 };
  }

  /**
   * Feature an offer (for now, sets is_featured to true; payment integration will be in Phase 10)
   */
  async featureOffer(offerId: string, userId: string, token: string) {
    const supabase = createSupabaseClient(token);

    // Check ownership
    const { data: existing, error: existError } = await supabaseAdmin
      .from('offers')
      .select('profile_id, is_featured')
      .eq('id', offerId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Offer not found');
    }

    if (existing.profile_id !== userId) {
      throw ApiError.forbidden('You do not have permission to feature this offer');
    }

    if (existing.is_featured) {
      throw ApiError.badRequest('Offer is already featured');
    }

    // In the future: redirect to Stripe or check paid status. For now, mark it featured directly.
    const { data, error } = await supabase
      .from('offers')
      .update({ is_featured: true })
      .eq('id', offerId)
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }
}

export const offerService = new OfferService();
