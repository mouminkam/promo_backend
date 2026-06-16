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
}

export const adminContentService = new AdminContentService();
