// ============================================
// Promoo Backend — Story Service
// ============================================

import { supabaseAdmin, createSupabaseClient } from '../config/supabase';
import { ApiError } from '../utils/apiError';

export class StoryService {
  async createStory(userId: string, token: string, payload: { media_url: string }) {
    const supabase = createSupabaseClient(token);

    // Default expiration: 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data, error } = await supabase
      .from('stories')
      .insert({
        profile_id: userId,
        media_url: payload.media_url,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  async getActiveStories() {
    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from('stories')
      .select('*, profile:profiles(id, full_name, username, avatar_url, account_type)')
      .gt('expires_at', now)
      .order('created_at', { ascending: false });

    if (error) {
      throw ApiError.internal(error.message);
    }

    // Group stories by user could be done here or on the frontend.
    // We return flat array for flexibility.
    return data;
  }

  async getMyStories(userId: string) {
    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from('stories')
      .select('*')
      .eq('profile_id', userId)
      .gt('expires_at', now)
      .order('created_at', { ascending: false });

    if (error) {
      throw ApiError.internal(error.message);
    }

    return data;
  }

  async getUserStories(userId: string) {
    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from('stories')
      .select('*, profile:profiles(id, full_name, username, avatar_url, account_type)')
      .eq('profile_id', userId)
      .gt('expires_at', now)
      .order('created_at', { ascending: true });

    if (error) {
      throw ApiError.internal(error.message);
    }

    return data;
  }

  async deleteStory(storyId: string, userId: string, token: string) {
    const supabase = createSupabaseClient(token);

    const { data: existing, error: existError } = await supabaseAdmin
      .from('stories')
      .select('profile_id')
      .eq('id', storyId)
      .single();

    if (existError || !existing) {
      throw ApiError.notFound('Story not found');
    }

    if (existing.profile_id !== userId) {
      throw ApiError.forbidden('You do not have permission to delete this story');
    }

    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId);

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return true;
  }
}

export const storyService = new StoryService();
