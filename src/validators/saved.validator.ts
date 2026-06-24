// ============================================
// Promoo Backend — Saved Items Validators
// ============================================

import { z } from 'zod';

export const saveItemSchema = z.object({
  body: z.object({
    item_id: z.string().uuid('Invalid item ID'),
    item_type: z.enum(['offer', 'ad', 'profile']),
  }),
});

export const savedItemIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid saved item ID'),
  }),
});
