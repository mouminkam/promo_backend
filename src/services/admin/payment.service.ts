// ============================================
// Promoo Backend — Admin Payment Service
// ============================================

import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/apiError';

export class AdminPaymentService {
  /**
   * Get all payments (Read-only)
   */
  async getPayments(filters: any, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('payments')
      .select('*, profile:profiles!profile_id(id, full_name, username, account_type)', { count: 'exact' });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
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
}

export const adminPaymentService = new AdminPaymentService();
