// ============================================
// Promoo Backend — Offer Validators
// ============================================

import { z } from 'zod';

// For creating a new offer
export const createOfferSchema = z.object({
  body: z.object({
    category_id: z.string().uuid('Invalid category ID'),
    title: z.string().min(3, 'Title must be at least 3 characters').max(150, 'Title cannot exceed 150 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    original_price: z.number().positive('Original price must be positive').optional(),
    offer_price: z.number().positive('Offer price must be positive'),
    discount_percentage: z.number().int().min(0).max(100).optional(),
    media_urls: z.array(z.string().url('Invalid media URL')).optional().default([]),
    start_date: z.string().datetime({ message: 'Start date must be a valid ISO datetime' }),
    end_date: z.string().datetime({ message: 'End date must be a valid ISO datetime' }).optional(),
    status: z.enum(['draft', 'active']).optional().default('active'),
  }).refine((data) => {
    if (data.original_price && data.offer_price >= data.original_price) {
      return false;
    }
    return true;
  }, {
    message: 'Offer price must be less than original price',
    path: ['offer_price'],
  }),
});

// For updating an existing offer
export const updateOfferSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid offer ID'),
  }),
  body: z.object({
    category_id: z.string().uuid('Invalid category ID').optional(),
    title: z.string().min(3, 'Title must be at least 3 characters').max(150, 'Title cannot exceed 150 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    original_price: z.number().positive('Original price must be positive').optional(),
    offer_price: z.number().positive('Offer price must be positive').optional(),
    discount_percentage: z.number().int().min(0).max(100).optional(),
    media_urls: z.array(z.string().url('Invalid media URL')).optional(),
    start_date: z.string().datetime({ message: 'Start date must be a valid ISO datetime' }).optional(),
    end_date: z.string().datetime({ message: 'End date must be a valid ISO datetime' }).optional(),
    status: z.enum(['draft', 'active', 'expired', 'rejected']).optional(),
  }),
});

// For retrieving lists of offers (query filtering)
export const getOffersQuerySchema = z.object({
  query: z.object({
    category_id: z.string().uuid('Invalid category ID').optional(),
    min_price: z.string().regex(/^\d+(\.\d+)?$/).optional().transform(Number),
    max_price: z.string().regex(/^\d+(\.\d+)?$/).optional().transform(Number),
    location: z.string().optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional().transform(Number).default(1),
    limit: z.string().regex(/^\d+$/).optional().transform(Number).default(20),
  }),
});

// For path params
export const offerIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid offer ID'),
  }),
});
