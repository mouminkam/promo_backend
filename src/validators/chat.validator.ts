// ============================================
// Promoo Backend — Chat Validators
// ============================================

import { z } from 'zod';

export const startChatSchema = z.object({
  body: z.object({
    participant_id: z.string().uuid('Invalid participant ID'),
  }),
});

export const sendMessageSchema = z.object({
  params: z.object({
    roomId: z.string().uuid('Invalid room ID'),
  }),
  body: z.object({
    content: z.string().min(1).max(5000).optional(),
    type: z.enum(['text', 'image', 'video', 'file']).default('text'),
    media_url: z.string().url().optional(),
  }).refine(
    (data) => data.content || data.media_url,
    { message: 'Either content or media_url must be provided' }
  ),
});

export const getMessagesSchema = z.object({
  params: z.object({
    roomId: z.string().uuid('Invalid room ID'),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  }).optional(),
});

export const markReadSchema = z.object({
  params: z.object({
    roomId: z.string().uuid('Invalid room ID'),
  }),
});

export const deleteChatSchema = z.object({
  params: z.object({
    roomId: z.string().uuid('Invalid room ID'),
  }),
});

export const getChatListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  }).optional(),
});
