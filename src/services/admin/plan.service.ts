// ============================================
// Promoo Backend — Admin Plan Service
// ============================================

import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/apiError';

export class AdminPlanService {
  /**
   * Get all subscription plans
   */
  async getPlans() {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw ApiError.internal(error.message);
    return data;
  }

  /**
   * Create a new subscription plan
   */
  async createPlan(payload: any) {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .insert(payload)
      .select()
      .single();

    if (error) throw ApiError.internal(error.message);
    return data;
  }

  /**
   * Update an existing subscription plan
   */
  async updatePlan(planId: string, payload: any) {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .update(payload)
      .eq('id', planId)
      .select()
      .single();

    if (error) throw ApiError.internal(error.message);
    return data;
  }

  /**
   * Delete a subscription plan
   */
  async deletePlan(planId: string) {
    // Before deleting, ensure no active subscriptions rely on it
    const { count } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('plan_id', planId)
      .in('status', ['active', 'trialing']);

    if (count && count > 0) {
      throw ApiError.badRequest('Cannot delete plan because there are active subscriptions using it');
    }

    const { error } = await supabaseAdmin.from('subscription_plans').delete().eq('id', planId);
    if (error) throw ApiError.internal(error.message);
    return { success: true };
  }
}

export const adminPlanService = new AdminPlanService();
