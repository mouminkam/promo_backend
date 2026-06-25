// ============================================
// Promoo Backend — Leaderboard (Cup) Validators
// ============================================

import { z } from 'zod';

// 'all' returns every non-user account (companies, influencers, providers).
// A specific account_type narrows the ranking to that segment.
export const leaderboardQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(Number).default(1),
    limit: z.string().regex(/^\d+$/).optional().transform(Number).default(20),
    type: z
      .enum(['all', 'company', 'influencer', 'service_provider'])
      .optional()
      .default('all'),
  }),
});
