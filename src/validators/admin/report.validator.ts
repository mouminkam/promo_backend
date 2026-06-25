// ============================================
// Promoo Backend — Admin Report Validator
// ============================================

import { z } from 'zod';

export const getReportsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
    status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']).optional(),
    type: z.enum(['profile', 'offer', 'ad', 'message', 'service', 'story', 'seat']).optional(),
  }).optional(),
});

export const updateReportStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid report ID'),
  }),
  body: z.object({
    status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']),
    admin_note: z.string().max(1000).optional(),
  }),
});
