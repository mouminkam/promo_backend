// ============================================
// Promoo Backend — Report Validator
// ============================================

import { z } from 'zod';

export const createReportSchema = z.object({
  body: z.object({
    reported_id: z.string().uuid('Invalid reported ID'),
    reported_type: z.enum(['profile', 'offer', 'ad', 'message', 'service', 'story', 'seat']),
    reason: z.string().min(3, 'Reason must be at least 3 characters').max(255),
    details: z.string().max(1000).optional(),
  }),
});
