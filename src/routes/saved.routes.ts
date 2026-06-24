// ============================================
// Promoo Backend — Saved Items Routes
// ============================================

import { Router } from 'express';
import { savedController } from '../controllers/saved.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import * as savedValidators from '../validators/saved.validator';

const router = Router();

// Protected routes only
router.use(requireAuth);

router.get('/', savedController.getSavedItems);

router.post(
  '/',
  validate(savedValidators.saveItemSchema),
  savedController.saveItem
);

router.delete(
  '/:id',
  validate(savedValidators.savedItemIdSchema),
  savedController.unsaveItem
);

export default router;
