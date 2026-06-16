// ============================================
// Promoo Backend — Admin Report Service
// ============================================

import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/apiError';

export class AdminReportService {
  /**
   * Get all reports
   */
  async getReports(filters: any, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('reports')
      .select('*, reporter:profiles!reporter_id(id, full_name, username)', { count: 'exact' });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.type) {
      query = query.eq('reported_type', filters.type);
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
   * Update report status and admin note
   */
  async updateReportStatus(reportId: string, status: string, adminNote?: string) {
    const updatePayload: any = { status };
    if (adminNote !== undefined) {
      updatePayload.admin_note = adminNote;
    }
    if (status === 'resolved' || status === 'dismissed') {
      updatePayload.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('reports')
      .update(updatePayload)
      .eq('id', reportId)
      .select()
      .single();

    if (error) {
      throw ApiError.internal(error.message);
    }

    return data;
  }
}

export const adminReportService = new AdminReportService();
