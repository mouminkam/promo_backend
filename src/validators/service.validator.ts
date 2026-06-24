// ============================================
// Promoo Backend — Service Validators
// ============================================

import { z } from 'zod';

export const createServiceSchema = z.object({
  body: z.object({
    category_id: z.string().uuid('Invalid category ID'),
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    currency: z.string().optional().default('AED'),
    delivery_days: z.number().int().positive('Delivery days must be at least 1'),
    media_urls: z.array(z.string().url('Invalid media URL')).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateServiceSchema = z.object({
  body: z.object({
    category_id: z.string().uuid().optional(),
    title: z.string().min(5).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    currency: z.string().optional(),
    delivery_days: z.number().int().positive().optional(),
    media_urls: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['active', 'paused', 'deleted']).optional(),
  }),
});

export const serviceIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid service ID'),
  }),
});
