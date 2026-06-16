// ============================================
// Promoo Backend — Report Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';

export interface ICreateReportPayload {
  reported_id: string;
  reported_type: 'profile' | 'offer' | 'ad' | 'message';
  reason: string;
  details?: string;
}

export class ReportService {
  /**
   * Submit a new report
   */
  async createReport(reporterId: string, payload: ICreateReportPayload) {
    // Basic verification: don't let a user report themselves
    if (payload.reported_type === 'profile' && payload.reported_id === reporterId) {
      throw ApiError.badRequest('You cannot report yourself');
    }

    // Check if user already reported this exact item to prevent spam
    const { data: existingReport } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('reporter_id', reporterId)
      .eq('reported_id', payload.reported_id)
      .in('status', ['pending', 'reviewed'])
      .maybeSingle();

    if (existingReport) {
      throw ApiError.badRequest('You have already reported this item and it is currently under review');
    }

    const { data, error } = await supabaseAdmin
      .from('reports')
      .insert({
        reporter_id: reporterId,
        reported_id: payload.reported_id,
        reported_type: payload.reported_type,
        reason: payload.reason,
        details: payload.details || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw ApiError.internal(`Failed to submit report: ${error.message}`);
    }

    return data;
  }

  /**
   * Get my submitted reports
   */
  async getMyReports(reporterId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const { count } = await supabaseAdmin
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('reporter_id', reporterId);

    const total = count || 0;

    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('reporter_id', reporterId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw ApiError.internal(error.message);
    }

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Admin methods (GET all reports, resolve report) will be implemented in Phase 12 (Admin Dashboard APIs).
}

export const reportService = new ReportService();
