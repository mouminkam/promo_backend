// ============================================
// Promoo Backend — Ad Validators
// ============================================

import { z } from 'zod';

// For creating a new advertisement
export const createAdSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    media_url: z.string().url('Invalid media URL'),
    ad_type: z.enum(['banner', 'popup', 'featured']),
    target_url: z.string().url('Invalid target URL').optional().or(z.literal('')),
    budget: z.number().positive('Budget must be positive'),
    start_date: z.string().datetime({ message: 'Start date must be a valid ISO datetime' }),
    end_date: z.string().datetime({ message: 'End date must be a valid ISO datetime' }).optional(),
  }),
});

// For updating an existing advertisement
export const updateAdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ad ID'),
  }),
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    media_url: z.string().url('Invalid media URL').optional(),
    ad_type: z.enum(['banner', 'popup', 'featured']).optional(),
    target_url: z.string().url('Invalid target URL').optional().or(z.literal('')),
    budget: z.number().positive('Budget must be positive').optional(),
    start_date: z.string().datetime({ message: 'Start date must be a valid ISO datetime' }).optional(),
    end_date: z.string().datetime({ message: 'End date must be a valid ISO datetime' }).optional(),
    status: z.enum(['pending', 'active', 'paused', 'completed', 'rejected']).optional(),
  }),
});

// Path parameter for ad ID
export const adIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ad ID'),
  }),
});

// For querying ads (pagination and admin views)
export const getAdsQuerySchema = z.object({
  query: z.object({
    status: z.enum(['pending', 'active', 'paused', 'completed', 'rejected']).optional(),
    page: z.string().regex(/^\d+$/).optional().transform(Number).default(1),
    limit: z.string().regex(/^\d+$/).optional().transform(Number).default(20),
  }),
});
