// ============================================
// Promoo Backend — Notification Controller
// ============================================

import { Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class NotificationController {
  /**
   * Get notifications for the current user
   */
  async getNotifications(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await notificationService.getNotifications(userId, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Notifications retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const notificationId = req.params.id as string;

      await notificationService.markAsRead(userId, notificationId);
      apiResponse.success(res, null, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      await notificationService.markAllAsRead(userId);
      apiResponse.success(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const notificationId = req.params.id as string;

      await notificationService.deleteNotification(userId, notificationId);
      apiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Register FCM Token
   */
  async registerToken(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { token, device_type } = req.body;

      await notificationService.registerToken(userId, token, device_type);
      apiResponse.success(res, null, 'FCM token registered successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
