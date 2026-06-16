// ============================================
// Promoo Backend — Admin Category Service
// ============================================

import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/apiError';

export class AdminCategoryService {
  /**
   * Create a new category
   */
  async createCategory(payload: any) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(payload)
      .select()
      .single();

    if (error) throw ApiError.internal(error.message);
    return data;
  }

  /**
   * Update a category
   */
  async updateCategory(categoryId: string, payload: any) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(payload)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) throw ApiError.internal(error.message);
    return data;
  }

  /**
   * Delete a category
   */
  async deleteCategory(categoryId: string) {
    // Check if category is used in offers
    const { count } = await supabaseAdmin
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    if (count && count > 0) {
      throw ApiError.badRequest('Cannot delete category because there are offers using it');
    }

    const { error } = await supabaseAdmin.from('categories').delete().eq('id', categoryId);
    if (error) throw ApiError.internal(error.message);
    return { success: true };
  }
}

export const adminCategoryService = new AdminCategoryService();
