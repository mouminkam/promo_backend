// ============================================
// Promoo Backend — Rate Limiting Middleware
// ============================================

import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

/**
 * Escape hatch for local integration testing only. When DISABLE_RATE_LIMIT=true
 * (never set in production), all limiters become no-ops so a full end-to-end
 * API sweep isn't throttled. Defaults to OFF, so production behaviour is unchanged.
 */
const RATE_LIMIT_DISABLED = process.env.DISABLE_RATE_LIMIT === 'true';
const passthrough = (_req: Request, _res: Response, next: NextFunction): void => next();

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 */
export const generalLimiter = RATE_LIMIT_DISABLED ? passthrough : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Too many requests, please try again later',
    error: { code: 'RATE_LIMIT_EXCEEDED' },
  },
});

/**
 * Auth-specific rate limiter — stricter for login/register endpoints.
 * 10 attempts per 15 minutes per IP.
 */
export const authLimiter = RATE_LIMIT_DISABLED ? passthrough : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Too many authentication attempts, please try again later',
    error: { code: 'RATE_LIMIT_EXCEEDED' },
  },
});

/**
 * Upload rate limiter — 20 uploads per 15 minutes.
 */
export const uploadLimiter = RATE_LIMIT_DISABLED ? passthrough : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Upload limit exceeded, please try again later',
    error: { code: 'RATE_LIMIT_EXCEEDED' },
  },
});
