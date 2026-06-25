// ============================================
// Promoo Backend — Leaderboard (Cup) Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';

interface LeaderboardParams {
  page: number;
  limit: number;
  type: 'all' | 'company' | 'influencer' | 'service_provider';
}

export class LeaderboardService {
  /**
   * Get the Cup leaderboard: active accounts ranked by followers_count (desc).
   * Regular 'user' accounts are excluded — only companies, influencers and
   * service providers compete in the Cup.
   */
  async getLeaderboard({ page, limit, type }: LeaderboardParams) {
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('profiles')
      .select(
        'id, full_name, username, avatar_url, bio, account_type, followers_count, is_verified, is_featured',
        { count: 'exact' }
      )
      .eq('is_active', true)
      .order('followers_count', { ascending: false })
      .order('created_at', { ascending: true }) // stable tie-breaker
      .range(offset, offset + limit - 1);

    if (type === 'all') {
      query = query.neq('account_type', 'user');
    } else {
      query = query.eq('account_type', type);
    }

    const { data, count, error } = await query;
    if (error) throw ApiError.internal(error.message);

    const total = count || 0;

    // Attach 1-indexed rank based on the page offset
    const ranked = (data || []).map((profile, i) => ({
      rank: offset + i + 1,
      ...profile,
    }));

    return { data: ranked, total, page, limit };
  }
}

export const leaderboardService = new LeaderboardService();
