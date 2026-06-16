// ============================================
// Promoo Backend — Payment Validator
// ============================================

import { z } from 'zod';

export const getPaymentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  }).optional(),
});

export const getPaymentDetailsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid payment ID'),
  }),
});
