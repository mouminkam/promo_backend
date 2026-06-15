// ============================================
// Promoo Backend — Notification Routes
// ============================================

import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  getNotificationsSchema,
  idParamSchema,
  registerTokenSchema,
} from '../validators/notification.validator';

const router = Router();

// All notification routes require authentication
router.use(requireAuth);

router.get('/', validate(getNotificationsSchema), notificationController.getNotifications);

router.patch('/read-all', notificationController.markAllAsRead);

router.patch('/:id/read', validate(idParamSchema), notificationController.markAsRead);

router.delete('/:id', validate(idParamSchema), notificationController.deleteNotification);

router.post('/token', validate(registerTokenSchema), notificationController.registerToken);

export default router;
