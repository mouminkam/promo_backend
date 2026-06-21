// ============================================
// Promoo Backend — Featured Validator
// ============================================

import { z } from 'zod';

export const requestFeaturedSchema = z.object({
  body: z.object({
    placement: z.enum(['home', 'search', 'category']),
    duration_days: z.number().int().positive().min(1).max(365),
  }),
});

export const getFeaturedSchema = z.object({
  query: z.object({
    placement: z.enum(['home', 'search', 'category']).optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  }).optional(),
});
