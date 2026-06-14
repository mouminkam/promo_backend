// ============================================
// Promoo Backend — Chat Controller
// ============================================

import { Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class ChatController {
  /**
   * Start or open a chat with another user
   */
  async startChat(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { participantId } = req.body;

      const data = await chatService.startOrOpenChat(userId, participantId);

      if (data.isNew) {
        apiResponse.created(res, data, 'Chat created successfully');
      } else {
        apiResponse.success(res, data, 'Chat opened successfully');
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send a message in a chat room
   */
  async sendMessage(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.roomId as string;
      const { content, type, mediaUrl } = req.body;

      const data = await chatService.sendMessage(userId, roomId, { content, type, mediaUrl });
      apiResponse.created(res, data, 'Message sent successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get messages for a chat room
   */
  async getMessages(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.roomId as string;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await chatService.getMessages(userId, roomId, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Messages retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get the list of chats for the current user
   */
  async getChatList(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await chatService.getChatList(userId, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Chats retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark messages as read in a chat room
   */
  async markAsRead(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.roomId as string;

      await chatService.markAsRead(userId, roomId);
      apiResponse.success(res, null, 'Messages marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a chat
   */
  async deleteChat(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.roomId as string;

      await chatService.deleteChat(userId, roomId);
      apiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
