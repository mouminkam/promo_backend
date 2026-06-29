// ============================================
// Promoo Backend — Admin Content Service
// ============================================

import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/apiError';

export class AdminContentService {
  /**
   * Change offer status (e.g. approve 'active', 'rejected')
   */
  async updateOfferStatus(offerId: string, status: string) {
    const { data, error } = await supabaseAdmin
      .from('offers')
      .update({ status })
      .eq('id', offerId)
      .select()
      .single();

    if (error) throw ApiError.internal(error.message);
    return data;
  }

  /**
   * Delete an offer
   */
  async deleteOffer(offerId: string) {
    const { error } = await supabaseAdmin.from('offers').delete().eq('id', offerId);
    if (error) throw ApiError.internal(error.message);
    return { success: true };
  }

  /**
   * Change ad status (e.g. approve 'active', 'rejected')
   */
  async updateAdStatus(adId: string, status: string) {
    const { data, error } = await supabaseAdmin
      .from('ads')
      .update({ status })
      .eq('id', adId)
      .select()
      .single();

    if (error) throw ApiError.internal(error.message);
    return data;
  }

  /**
   * Delete an ad
   */
  async deleteAd(adId: string) {
    const { error } = await supabaseAdmin.from('ads').delete().eq('id', adId);
    if (error) throw ApiError.internal(error.message);
    return { success: true };
  }

  // ─── Admin moderation lists (ALL statuses, with owner) ───────────
  // The public list endpoints only return active content; admins need to see
  // pending/draft/rejected items to moderate them.
  private range(page: number, limit: number) {
    const from = (page - 1) * limit;
    return { from, to: from + limit - 1 };
  }

  async listOffers(page: number, limit: number, status?: string) {
    const { from, to } = this.range(page, limit);
    let query = supabaseAdmin
      .from('offers')
      .select('*, profile:profiles(id, full_name, username, avatar_url), category:categories(id, name_en, name_ar, slug)', { count: 'exact' });
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query.range(from, to).order('created_at', { ascending: false });
    if (error) throw ApiError.internal(error.message);
    return { data: data ?? [], count: count ?? 0 };
  }

  async listAds(page: number, limit: number, status?: string) {
    const { from, to } = this.range(page, limit);
    let query = supabaseAdmin
      .from('ads')
      .select('*, profile:profiles(id, full_name, username, avatar_url)', { count: 'exact' });
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query.range(from, to).order('created_at', { ascending: false });
    if (error) throw ApiError.internal(error.message);
    return { data: data ?? [], count: count ?? 0 };
  }

  async listServices(page: number, limit: number, status?: string) {
    const { from, to } = this.range(page, limit);
    let query = supabaseAdmin
      .from('services')
      .select('*, profile:profiles(id, full_name, username, avatar_url), category:categories(id, name_en, name_ar, slug)', { count: 'exact' });
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query.range(from, to).order('created_at', { ascending: false });
    if (error) throw ApiError.internal(error.message);
    return { data: data ?? [], count: count ?? 0 };
  }
}

export const adminContentService = new AdminContentService();
