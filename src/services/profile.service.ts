// ============================================
// Promoo Backend — Profile Service
// ============================================

import { supabaseAdmin, createSupabaseClient } from '../config/supabase';
import { ApiError } from '../utils/apiError';

export class ProfileService {
  /**
   * Get a profile by ID
   */
  async getProfileById(profileId: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*, categories(id, name_ar, name_en, slug, icon_url)')
      .eq('id', profileId)
      .single();

    if (error || !data) {
      throw ApiError.notFound('Profile not found');
    }
    return data;
  }

  /**
   * Get a profile by Username
   */
  async getProfileByUsername(username: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*, categories(id, name_ar, name_en, slug, icon_url)')
      .eq('username', username)
      .single();

    if (error || !data) {
      throw ApiError.notFound('Profile not found');
    }
    return data;
  }

  /**
   * Update Own Profile
   */
  async updateProfile(userId: string, token: string, payload: any) {
    const supabase = createSupabaseClient(token);
    
    // Check if username is taken by someone else
    if (payload.username) {
      const { data: existing } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('username', payload.username)
        .neq('id', userId)
        .single();
        
      if (existing) {
        throw ApiError.badRequest('Username is already taken');
      }
    }

    // Perform update using the user's token (RLS protected)
    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }
    return data;
  }

  /**
   * Update Avatar URL
   */
  async updateAvatar(userId: string, token: string, avatarUrl: string) {
    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }
    return data;
  }

  /**
   * Update Cover URL
   */
  async updateCover(userId: string, token: string, coverUrl: string) {
    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase
      .from('profiles')
      .update({ cover_url: coverUrl })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }
    return data;
  }

  /**
   * Request Verification
   */
  async requestVerification(userId: string, documentUrl: string, notes?: string) {
    const { data, error } = await supabaseAdmin
      .from('verification_requests')
      .insert({
        profile_id: userId,
        document_url: documentUrl,
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw ApiError.internal(error.message);
    }
    return data;
  }

  /**
   * Delete Account
   */
  async deleteAccount(userId: string) {
    // This deletes the user from auth.users, and CASCADE will delete the profile
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) {
      throw ApiError.internal(error.message);
    }
    return true;
  }

  /**
   * Get Profile Media Grid
   */
  async getProfileMedia(profileId: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseAdmin
      .from('media')
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

export const profileService = new ProfileService();
