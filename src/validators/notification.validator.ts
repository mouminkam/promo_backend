// ============================================
// Promoo Backend — Notification Validators
// ============================================

import { z } from 'zod';

export const getNotificationsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  }).optional(),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid notification ID'),
  }),
});

export const registerTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    device_type: z.enum(['ios', 'android', 'web']).optional(),
  }),
});
