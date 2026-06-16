// ============================================
// Promoo Backend — Admin User Validator
// ============================================

import { z } from 'zod';

export const getUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
    search: z.string().optional(),
    accountType: z.enum(['company', 'influencer', 'service_provider', 'user']).optional(),
    isVerified: z.enum(['true', 'false']).optional(),
    isActive: z.enum(['true', 'false']).optional(),
  }).optional(),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

export const toggleBanSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const toggleVerifySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    isVerified: z.boolean(),
  }),
});
