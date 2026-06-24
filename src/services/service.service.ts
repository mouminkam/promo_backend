// ============================================
// Promoo Backend — Service Service
// ============================================

import { supabaseAdmin, createSupabaseClient } from '../config/supabase';
import { ApiError } from '../utils/apiError';

export class ServiceService {
  async getServices(params: { page: number; limit: number; categoryId?: string; q?: string }) {
    const offset = (params.page - 1) * params.limit;

    let query = supabaseAdmin
      .from('services')
      .select('*, profile:profiles(id, full_name, username, avatar_url, is_verified, account_type), category:categories(id, name_ar, name_en, slug)', { count: 'exact' })
      .eq('status', 'active');

    if (params.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }
    if (params.q) {
      query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + params.limit - 1);

    if (error) {
      throw ApiError.internal(error.message);
    }

    const total = count || 0;
    return {
      data,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
    };
  }

  async getServiceById(serviceId: string) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*, profile:profiles(id, full_name, username, avatar_url, is_verified, account_type), category:categories(id, name_ar, name_en, slug)')
      .eq('id', serviceId)
      .single();

    if (error || !data) {
      throw ApiError.notFound('Service not found');
    }

    // Increment views
    try {
      await supabaseAdmin.rpc('increment_service_views', { service_id: serviceId });
    } catch (e) {
      console.error(e);
    }

    return data;
  }

  async createService(userId: string, token: string, payload: any) {
    const supabase = createSupabaseClient(token);

    const { data, error } = await supabase
      .from('services')
      .insert({
        profile_id: userId,
        category_id: payload.category_id,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        currency: payload.currency || 'AED',
        delivery_days: payload.delivery_days,
        media_urls: payload.media_urls || [],
        tags: payload.tags || [],
        status: payload.status || 'active',
      })
      .select('*, category:categories(id, name_ar, name_en, slug)')
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  async updateService(serviceId: string, userId: string, token: string, payload: any) {
    const supabase = createSupabaseClient(token);

    const { data, error } = await supabase
      .from('services')
      .update(payload)
      .eq('id', serviceId)
      .eq('profile_id', userId)
      .select('*, category:categories(id, name_ar, name_en, slug)')
      .single();

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return data;
  }

  async deleteService(serviceId: string, userId: string, token: string) {
    const supabase = createSupabaseClient(token);

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)
      .eq('profile_id', userId);

    if (error) {
      throw ApiError.badRequest(error.message);
    }

    return true;
  }
}

export const serviceService = new ServiceService();
