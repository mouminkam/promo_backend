// ============================================
// Promoo Backend — Admin Offer/Ad Validator
// ============================================

import { z } from 'zod';

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ID'),
  }),
  body: z.object({
    status: z.enum(['active', 'rejected', 'pending', 'expired', 'paused', 'completed']),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ID'),
  }),
});

export const listContentSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().positive().default(1).optional(),
      limit: z.coerce.number().int().positive().max(100).default(20).optional(),
      status: z.string().optional(),
    })
    .optional(),
});
