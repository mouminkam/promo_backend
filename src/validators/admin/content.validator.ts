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
