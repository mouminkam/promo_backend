// ============================================
// Promoo Backend — Admin Payment Validator
// ============================================

import { z } from 'zod';

export const getPaymentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
    status: z.enum(['succeeded', 'pending', 'failed', 'refunded']).optional(),
    type: z.enum(['subscription', 'ad', 'featured']).optional(),
  }).optional(),
});
