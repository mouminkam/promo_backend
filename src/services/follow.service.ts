// ============================================
// Promoo Backend — Follow Service
// ============================================

import { supabaseAdmin, createSupabaseClient } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import { notificationService } from './notification.service';

export class FollowService {
  /**
   * Follow a profile
   */
  async followProfile(followerId: string, followingId: string, token: string) {
    if (followerId === followingId) {
      throw ApiError.badRequest('You cannot follow yourself');
    }

    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw ApiError.badRequest('You are already following this profile');
      }
      throw ApiError.badRequest(error.message);
    }
    
    // Create a notification for the followed user
    await notificationService.sendNotification(
      followingId,
      'New Follower',
      'Someone started following you.',
      'follow',
      { follower_id: followerId }
    );

    return data;
  }

  /**
   * Unfollow a profile
   */
  async unfollowProfile(followerId: string, followingId: string, token: string) {
    const supabase = createSupabaseClient(token);
    const { error } = await supabase
      .from('follows')
      .delete()
      .match({ follower_id: followerId, following_id: followingId });

    if (error) {
      throw ApiError.badRequest(error.message);
    }
    return true;
  }

  /**
   * Check if I follow a profile
   */
  async checkFollowStatus(followerId: string, followingId: string) {
    const { data, error } = await supabaseAdmin
      .from('follows')
      .select('id')
      .match({ follower_id: followerId, following_id: followingId })
      .maybeSingle();

    if (error) {
      throw ApiError.internal(error.message);
    }
    return { isFollowing: !!data };
  }

  /**
   * Get Followers (People who follow the target)
   */
  async getFollowers(profileId: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseAdmin
      .from('follows')
      .select('created_at, follower:profiles!follower_id(id, full_name, username, avatar_url, account_type)', { count: 'exact' })
      .eq('following_id', profileId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw ApiError.internal(error.message);
    }
    return { data, count: count || 0 };
  }

  /**
   * Get Following (People the target is following)
   */
  async getFollowing(profileId: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseAdmin
      .from('follows')
      .select('created_at, following:profiles!following_id(id, full_name, username, avatar_url, account_type)', { count: 'exact' })
      .eq('follower_id', profileId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw ApiError.internal(error.message);
    }
    return { data, count: count || 0 };
  }
}

export const followService = new FollowService();
