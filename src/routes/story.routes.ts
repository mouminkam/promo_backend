// ============================================
// Promoo Backend — Story Routes
// ============================================

import { Router } from 'express';
import { storyController } from '../controllers/story.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import * as storyValidators from '../validators/story.validator';

const router = Router();

// Public routes
router.get('/', storyController.getActiveStories);

router.get(
  '/user/:userId',
  validate(storyValidators.userIdParamSchema),
  storyController.getUserStories
);

// Protected routes
router.use(requireAuth);

router.get('/me', storyController.getMyStories);

router.post(
  '/',
  validate(storyValidators.createStorySchema),
  storyController.createStory
);

router.delete(
  '/:id',
  validate(storyValidators.storyIdParamSchema),
  storyController.deleteStory
);

export default router;
