// ============================================
// Promoo Backend — Subscription Validators
// ============================================

import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    planId: z.string().uuid('Invalid plan ID'),
  }),
});

export const changeSubscriptionSchema = z.object({
  body: z.object({
    newPlanId: z.string().uuid('Invalid new plan ID'),
  }),
});
