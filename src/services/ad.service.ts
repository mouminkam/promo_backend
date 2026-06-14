// ============================================
// Promoo Backend — Ad Service
// ============================================

import { supabaseAdmin, createSupabaseClient } from '../config/supabase';
import { ApiError } from '../utils/apiError';

export class AdService {
  /**
   * Create a new advertisement
   */
  async createAd(userId: string, token: string, payload: any) {
    const supabase = createSupabaseClient(token);

    const { data, error } = await supabase
      .from('ads')
      .insert({
        profile_id: userId,
        title: payload.title,
        description: payload.description,
        media_url: payload.media_url,
        ad_type: payload.ad_type,
        target_url: payload.target_url,
        budget: payload.budget,
        start_date: payload.start_date,
        end_date: payload.end_date,
        status: 'pending', // Starts as pending until payment/admin approval
      })
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  /**
   * Update an existing advertisement
   */
  async updateAd(adId: string, userId: string, token: string, payload: any) {
    const supabase = createSupabaseClient(token);

    const { data: existing, error: existError } = await supabaseAdmin
      .from('ads')
      .select('profile_id')
      .eq('id', adId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Ad not found');
    }

    if (existing.profile_id !== userId) {
      throw ApiError.forbidden('You do not have permission to update this ad');
    }

    // Don't let users update status directly here
    const { status, spent, impressions, clicks, ...updatablePayload } = payload;

    const { data, error } = await supabase
      .from('ads')
      .update(updatablePayload)
      .eq('id', adId)
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  /**
   * Toggle Ad status (only active <-> paused)
   */
  async toggleAd(adId: string, userId: string, token: string) {
    const supabase = createSupabaseClient(token);

    const { data: existing, error: existError } = await supabaseAdmin
      .from('ads')
      .select('profile_id, status')
      .eq('id', adId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Ad not found');
    }

    if (existing.profile_id !== userId) {
      throw ApiError.forbidden('You do not have permission to toggle this ad');
    }

    let newStatus: string;
    if (existing.status === 'active') {
      newStatus = 'paused';
    } else if (existing.status === 'paused') {
      newStatus = 'active';
    } else {
      throw ApiError.badRequest(`Cannot toggle ad with status: ${existing.status}`);
    }

    const { data, error } = await supabase
      .from('ads')
      .update({ status: newStatus })
      .eq('id', adId)
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  /**
   * Get Ad stats (impressions, clicks, spent)
   */
  async getAdStats(adId: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from('ads')
      .select('id, profile_id, impressions, clicks, budget, spent, status')
      .eq('id', adId)
      .single();

    if (error || !data) {
      throw ApiError.notFound('Ad not found');
    }

    if (data.profile_id !== userId) {
      throw ApiError.forbidden('You do not have permission to view stats for this ad');
    }

    return {
      impressions: data.impressions || 0,
      clicks: data.clicks || 0,
      budget: data.budget || 0,
      spent: data.spent || 0,
      status: data.status,
      ctr: data.impressions ? ((data.clicks || 0) / data.impressions) * 100 : 0,
    };
  }

  /**
   * Record Impression (Public endpoint)
   */
  async recordImpression(adId: string) {
    const { data: existing, error: existError } = await supabaseAdmin
      .from('ads')
      .select('impressions, budget, spent, status')
      .eq('id', adId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Ad not found');
    }

    if (existing.status !== 'active') {
      throw ApiError.badRequest('Ad is not active');
    }

    // Cost model: simple simulated cost per impression, e.g., $0.01
    const costPerImpression = 0.01;
    const newSpent = (existing.spent || 0) + costPerImpression;
    const isCompleted = newSpent >= existing.budget;

    const { data, error } = await supabaseAdmin
      .from('ads')
      .update({
        impressions: (existing.impressions || 0) + 1,
        spent: newSpent,
        status: isCompleted ? 'completed' : 'active',
      })
      .eq('id', adId)
      .select()
      .single();

    if (error) {
      throw ApiError.internal(error.message);
    }

    return data;
  }

  /**
   * Record Click (Public endpoint)
   */
  async recordClick(adId: string) {
    const { data: existing, error: existError } = await supabaseAdmin
      .from('ads')
      .select('clicks, budget, spent, status')
      .eq('id', adId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Ad not found');
    }

    if (existing.status !== 'active') {
      throw ApiError.badRequest('Ad is not active');
    }

    // Cost model: simple simulated cost per click, e.g., $0.10
    const costPerClick = 0.10;
    const newSpent = (existing.spent || 0) + costPerClick;
    const isCompleted = newSpent >= existing.budget;

    const { data, error } = await supabaseAdmin
      .from('ads')
      .update({
        clicks: (existing.clicks || 0) + 1,
        spent: newSpent,
        status: isCompleted ? 'completed' : 'active',
      })
      .eq('id', adId)
      .select()
      .single();

    if (error) {
      throw ApiError.internal(error.message);
    }

    return data;
  }

  /**
   * Get active ads by type for public display
   */
  async getActiveAds(adType?: string) {
    let query = supabaseAdmin
      .from('ads')
      .select('id, profile_id, title, description, media_url, ad_type, target_url')
      .eq('status', 'active');

    if (adType) {
      query = query.eq('ad_type', adType);
    }

    const { data, error } = await query;

    if (error) {
      throw ApiError.internal(error.message);
    }

    return data;
  }

  /**
   * Get ads created by a specific profile
   */
  async getAdsByProfileId(profileId: string, page: number, limit: number, requestingUserId?: string) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Only allow the profile owner to view their ads (since ads contain budget, spent, status etc.)
    if (profileId !== requestingUserId) {
      throw ApiError.forbidden('You do not have permission to view these ads');
    }

    const { data, error, count } = await supabaseAdmin
      .from('ads')
      .select('*', { count: 'exact' })
      .eq('profile_id', profileId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw ApiError.internal(error.message);
    }

    return { data, count: count || 0 };
  }
}

export const adService = new AdService();
