// ============================================
// Promoo Backend — Story Validators
// ============================================

import { z } from 'zod';

export const createStorySchema = z.object({
  body: z.object({
    media_url: z.string().url('Invalid media URL'),
  }),
});

export const storyIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid story ID'),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID'),
  }),
});
