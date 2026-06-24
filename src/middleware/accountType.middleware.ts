import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import { IAuthRequest } from '../types/api.types';

/**
 * Middleware: Requires the user to have a specific account_type.
 * Must be used AFTER requireAuth middleware.
 * 
 * @param allowedTypes Array of allowed account types (e.g., ['company', 'service_provider'])
 */
export const requireAccountType = (allowedTypes: string[]) => {
  return async (req: IAuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        throw ApiError.unauthorized('User not authenticated');
      }

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('account_type')
        .eq('id', req.user.id)
        .single();

      if (error || !profile) {
        throw ApiError.internal('Could not retrieve user profile');
      }

      if (!profile.account_type || !allowedTypes.includes(profile.account_type)) {
        throw ApiError.forbidden(`Access denied. Allowed account types: ${allowedTypes.join(', ')}`);
      }

      // Optionally attach account_type to user object for downstream use
      (req.user as any).account_type = profile.account_type;

      next();
    } catch (error) {
      next(error);
    }
  };
};
