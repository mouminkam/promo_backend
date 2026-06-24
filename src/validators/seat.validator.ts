// ============================================
// Promoo Backend — Seat Validators
// ============================================

import { z } from 'zod';

export const getSeatsQuerySchema = z.object({
  query: z.object({
    tier: z.enum(['gold', 'silver', 'bronze']).optional(),
  }),
});

export const seatIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid seat ID'),
  }),
});
