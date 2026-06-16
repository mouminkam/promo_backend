// ============================================
// Promoo Backend — Admin Category Validator
// ============================================

import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name_ar: z.string().min(2, 'Arabic name must be at least 2 characters'),
    name_en: z.string().min(2, 'English name must be at least 2 characters'),
    icon_url: z.string().url('Icon must be a valid URL').optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
  body: createCategorySchema.shape.body.partial(),
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
});
