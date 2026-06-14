// ============================================
// Promoo Backend — Admin Middleware
// ============================================
// Checks if the authenticated user has admin privileges.
// Must be used AFTER requireAuth middleware.

import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import { IAuthRequest } from '../types/api.types';

/**
 * Middleware: Requires the user to be an admin.
 * Checks the `profiles` table for `is_admin = true`.
 *
 * Usage: router.get('/admin/users', requireAuth, requireAdmin, controller)
 */
export async function requireAdmin(
  req: IAuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    // Check if user is admin in the profiles table
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', req.user.id)
      .single();

    if (error || !profile || !profile.is_admin) {
      throw ApiError.forbidden('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
}
