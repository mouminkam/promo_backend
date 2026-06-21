// ============================================
// Promoo Backend — Auth Middleware
// ============================================
// Verifies the JWT from the Authorization header using Supabase.
// Attaches `req.user` and `req.language` for downstream use.

import { Response, NextFunction } from 'express';
import { supabaseAuth } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import { getLanguage } from '../utils/helpers';
import { IAuthRequest } from '../types/api.types';

/**
 * Middleware: Requires a valid JWT token.
 * Extracts user info from Supabase Auth and attaches to `req.user`.
 */
export async function requireAuth(
  req: IAuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw ApiError.unauthorized('Token is missing');
    }

    // Verify the JWT with Supabase using the throwaway auth client
    const { data, error } = await supabaseAuth.auth.getUser(token);

    if (error || !data.user) {
      throw ApiError.unauthorized('Invalid or expired token');
    }

    // Attach user info to request
    req.user = {
      id: data.user.id,
      email: data.user.email,
      phone: data.user.phone,
      role: data.user.role,
    };

    // Attach language preference
    req.language = getLanguage(req) as 'ar' | 'en';

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware: Optional auth — doesn't fail if no token provided.
 * Use for endpoints that show different data for logged-in vs anonymous users.
 */
export async function optionalAuth(
  req: IAuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const { data } = await supabaseAuth.auth.getUser(token);
        if (data.user) {
          req.user = {
            id: data.user.id,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
          };
        }
      }
    }

    req.language = getLanguage(req) as 'ar' | 'en';
    next();
  } catch {
    // Silently continue without user — token was invalid but that's OK
    req.language = getLanguage(req) as 'ar' | 'en';
    next();
  }
}
