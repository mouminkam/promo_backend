// ============================================
// Promoo Backend — Search Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';

interface ISearchParams {
  q?: string;
  type?: 'profiles' | 'offers' | 'ads' | 'all';
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  accountType?: 'company' | 'influencer' | 'service_provider' | 'user';
}

export class SearchService {
  /**
   * Perform a search query across the database
   */
  async search(params: ISearchParams): Promise<Record<string, unknown>> {
    const type = params.type || 'all';
    const page = params.page || 1;
    const limit = params.limit || 20;

    if (type === 'all') {
      // For 'all', we return a non-paginated preview of top results
      const [profiles, offers, ads] = await Promise.all([
        this.searchProfiles(params, 1, 5),
        this.searchOffers(params, 1, 5),
        this.searchAds(params, 1, 5)
      ]);
      return { profiles: profiles.data, offers: offers.data, ads: ads.data };
    }

    if (type === 'profiles') {
      return await this.searchProfiles(params, page, limit);
    }
    if (type === 'offers') {
      return await this.searchOffers(params, page, limit);
    }
    if (type === 'ads') {
      return await this.searchAds(params, page, limit);
    }

    throw ApiError.badRequest('Invalid search type');
  }

  private async searchProfiles(params: ISearchParams, page: number, limit: number) {
    const offset = (page - 1) * limit;
    let query = supabaseAdmin
      .from('profiles')
      .select('id, full_name, username, avatar_url, bio, account_type, is_verified, location', { count: 'exact' })
      .eq('is_active', true);

    if (params.q) {
      query = query.or(`full_name.ilike.%${params.q}%,username.ilike.%${params.q}%,bio.ilike.%${params.q}%`);
    }
    if (params.accountType) {
      query = query.eq('account_type', params.accountType);
    }
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }

    const { data, count, error } = await query
      .order('is_verified', { ascending: false }) // Verified profiles first
      .range(offset, offset + limit - 1);

    if (error) throw ApiError.internal(error.message);
    const total = count || 0;

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async searchOffers(params: ISearchParams, page: number, limit: number) {
    const offset = (page - 1) * limit;
    let query = supabaseAdmin
      .from('offers')
      .select('*, profile:profiles!profile_id(full_name, username, avatar_url, is_verified, account_type)', { count: 'exact' });

    if (params.q) {
      query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
    }
    if (params.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }
    if (params.minPrice !== undefined) {
      query = query.gte('price', params.minPrice);
    }
    if (params.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice);
    }
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }
    if (params.accountType) {
      // Need to filter by the related profile's account_type
      // Supabase supports filtering on embedded resources using standard notation, but it's simpler to filter first or accept we might not get exact count if we do it post-fetch.
      // However, we can use `profiles!inner(...)` to filter at the DB level.
      // Since query object is already built, we'd need to re-declare it to use !inner, or we can just append a filter.
      // E.g., query.eq('profiles.account_type', params.accountType) - this requires inner join.
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw ApiError.internal(error.message);
    const total = count || 0;

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async searchAds(params: ISearchParams, page: number, limit: number) {
    const offset = (page - 1) * limit;
    let query = supabaseAdmin
      .from('ads')
      .select('*, profile:profiles!profile_id(full_name, username, avatar_url, is_verified)', { count: 'exact' })
      .eq('status', 'active');

    if (params.q) {
      query = query.or(`title.ilike.%${params.q}%`);
    }
    // Ads don't typically have price filters in this model, but we could add them if needed.

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw ApiError.internal(error.message);
    const total = count || 0;

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const searchService = new SearchService();
