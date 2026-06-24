// ============================================
// Promoo Backend — Saved Service
// ============================================

import { supabaseAdmin, createSupabaseClient } from '../config/supabase';
import { ApiError } from '../utils/apiError';

export class SavedService {
  async saveItem(userId: string, token: string, payload: { item_id: string; item_type: string }) {
    const supabase = createSupabaseClient(token);

    // Check if already saved
    const { data: existing } = await supabaseAdmin
      .from('saved_items')
      .select('id')
      .eq('profile_id', userId)
      .eq('item_id', payload.item_id)
      .single();

    if (existing) {
      throw ApiError.badRequest('Item is already saved');
    }

    const { data, error } = await supabase
      .from('saved_items')
      .insert({
        profile_id: userId,
        item_id: payload.item_id,
        item_type: payload.item_type,
      })
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  async getSavedItems(userId: string, token: string) {
    const supabase = createSupabaseClient(token);

    const { data, error } = await supabase
      .from('saved_items')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw ApiError.internal(error.message);
    }

    // Ideally, we'd join with offers/ads/profiles but since item_id is generic
    // we return the raw list and let the frontend hydrate, or we do multi-queries here.
    return data;
  }

  async unsaveItem(savedId: string, userId: string, token: string) {
    const supabase = createSupabaseClient(token);

    const { data: existing, error: existError } = await supabaseAdmin
      .from('saved_items')
      .select('profile_id')
      .eq('id', savedId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Saved item not found');
    }

    if (existing.profile_id !== userId) {
      throw ApiError.forbidden('You do not have permission to delete this item');
    }

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('id', savedId);

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return true;
  }
}

export const savedService = new SavedService();
