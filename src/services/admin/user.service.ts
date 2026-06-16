// ============================================
// Promoo Backend — Admin User Service
// ============================================

import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/apiError';

export class AdminUserService {
  /**
   * Get all users with filters and pagination
   */
  async getUsers(filters: any, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' });

    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`);
    }
    if (filters.accountType) {
      query = query.eq('account_type', filters.accountType);
    }
    if (filters.isVerified !== undefined) {
      query = query.eq('is_verified', filters.isVerified === 'true');
    }
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive === 'true');
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw ApiError.internal(error.message);
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * Get user details
   */
  async getUserDetails(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw ApiError.notFound('User not found');
    }

    return data;
  }

  /**
   * Toggle user active/banned status
   */
  async toggleBan(userId: string, isActive: boolean) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw ApiError.internal(error.message);
    }

    return data;
  }

  /**
   * Toggle user verification status
   */
  async toggleVerify(userId: string, isVerified: boolean) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_verified: isVerified })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw ApiError.internal(error.message);
    }

    return data;
  }

  /**
   * Delete user permanently
   */
  async deleteUser(userId: string) {
    // Delete from Supabase Auth; this will trigger cascade deletion in public.profiles
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      throw ApiError.internal(error.message);
    }

    return { success: true };
  }
}

export const adminUserService = new AdminUserService();
