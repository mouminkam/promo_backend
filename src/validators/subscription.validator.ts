// ============================================
// Promoo Backend — Subscription Validators
// ============================================

import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    plan_id: z.string().uuid('Invalid plan ID'),
    return_url: z.string().url('Invalid return URL').optional(),
  }),
});

export const changeSubscriptionSchema = z.object({
  body: z.object({
    new_plan_id: z.string().uuid('Invalid new plan ID'),
  }),
});
