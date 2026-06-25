// ============================================
// Promoo Backend — Upload Validator
// ============================================

import { z } from 'zod';

export const uploadMediaSchema = z.object({
  body: z.object({
    related_to: z.enum(['profile', 'offer', 'ad', 'chat', 'service', 'story', 'report', 'verification']).optional(),
    related_id: z.string().uuid('Invalid related ID').optional(),
    bucket: z.string().optional(),
  }),
});

export const deleteFileSchema = z.object({
  params: z.object({
    fileId: z.string().uuid('Invalid file ID'),
  }),
});
