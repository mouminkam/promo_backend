// ============================================
// Promoo Backend — Category Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';

export class CategoryService {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Record<string, unknown>[]> {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw ApiError.internal(error.message);
    return data || [];
  }

  /**
   * Get content (offers) for a specific category
   */
  async getCategoryContent(categoryId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const { data, count, error } = await supabaseAdmin
      .from('offers')
      .select('*, profile:profiles!profile_id(full_name, username, avatar_url, is_verified, account_type)', { count: 'exact' })
      .eq('category_id', categoryId)
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

export const categoryService = new CategoryService();
