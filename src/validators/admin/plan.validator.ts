// ============================================
// Promoo Backend — Admin Plan Validator
// ============================================

import { z } from 'zod';

export const createPlanSchema = z.object({
  body: z.object({
    stripe_price_id: z.string().min(1, 'Stripe Price ID is required'),
    name_ar: z.string().min(2, 'Arabic name must be at least 2 characters'),
    name_en: z.string().min(2, 'English name must be at least 2 characters'),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    currency: z.string().default('usd'),
    interval: z.enum(['month', 'year']),
    features_ar: z.array(z.string()).default([]),
    features_en: z.array(z.string()).default([]),
    is_active: z.boolean().default(true),
  }),
});

export const updatePlanSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid plan ID'),
  }),
  body: createPlanSchema.shape.body.partial(),
});

export const planIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid plan ID'),
  }),
});
