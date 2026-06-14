// ============================================
// Promoo Backend — Chat Routes
// ============================================

import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import * as chatValidators from '../validators/chat.validator';

const router = Router();

// All chat routes require authentication
router.use(requireAuth);

// ─── Chat Room Routes ────────────────────────

// Get chat list
router.get(
  '/',
  validate(chatValidators.getChatListSchema),
  chatController.getChatList
);

// Start or open a chat
router.post(
  '/',
  validate(chatValidators.startChatSchema),
  chatController.startChat
);

// Get messages for a room
router.get(
  '/:roomId/messages',
  validate(chatValidators.getMessagesSchema),
  chatController.getMessages
);

// Send a message
router.post(
  '/:roomId/messages',
  validate(chatValidators.sendMessageSchema),
  chatController.sendMessage
);

// Mark messages as read
router.patch(
  '/:roomId/read',
  validate(chatValidators.markReadSchema),
  chatController.markAsRead
);

// Delete a chat
router.delete(
  '/:roomId',
  validate(chatValidators.deleteChatSchema),
  chatController.deleteChat
);

export default router;
