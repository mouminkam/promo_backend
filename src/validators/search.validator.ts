// ============================================
// Promoo Backend — Search Validator
// ============================================

import { z } from 'zod';

export const searchSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    type: z.enum(['profiles', 'offers', 'ads', 'all']).default('all').optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
    
    // Advanced filters
    categoryId: z.string().uuid('Invalid category ID').optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    location: z.string().optional(),
    accountType: z.enum(['company', 'influencer', 'service_provider', 'user']).optional(),
  }),
});
