// ============================================
// Promoo Backend — Follow Validators
// ============================================

import { z } from 'zod';

// We validate UUID params and pagination queries
export const profileIdParamSchema = z.object({
  params: z.object({
    profileId: z.string().uuid('Invalid profile ID'),
  }),
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(Number).default(1),
    limit: z.string().regex(/^\d+$/).optional().transform(Number).default(20),
  }),
});
