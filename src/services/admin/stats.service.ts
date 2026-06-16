// ============================================
// Promoo Backend — Admin Stats Service
// ============================================

import { supabaseAdmin } from '../../config/supabase';

export class AdminStatsService {
  /**
   * Get global dashboard statistics
   */
  async getGlobalStats() {
    // Total users
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Active ads
    const { count: activeAds } = await supabaseAdmin
      .from('ads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Pending reports
    const { count: pendingReports } = await supabaseAdmin
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Total revenue from successful payments
    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('amount')
      .eq('status', 'succeeded');

    const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    return {
      totalUsers: totalUsers || 0,
      activeAds: activeAds || 0,
      pendingReports: pendingReports || 0,
      totalRevenue
    };
  }
}

export const adminStatsService = new AdminStatsService();
