// ============================================
// Promoo Backend — Follow Routes
// ============================================

import { Router } from 'express';
import { followController } from '../controllers/follow.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import * as followValidators from '../validators/follow.validator';

const router = Router();

// ─── Protected Routes ────────────────────────────────────────
router.use(requireAuth);

router.post(
  '/:profileId',
  validate(followValidators.profileIdParamSchema),
  followController.followProfile
);

router.delete(
  '/:profileId',
  validate(followValidators.profileIdParamSchema),
  followController.unfollowProfile
);

router.get(
  '/:profileId/status',
  validate(followValidators.profileIdParamSchema),
  followController.checkFollowStatus
);

// We mount followers/following here to keep it grouped, 
// though the path will be /api/v1/follows/followers/:profileId instead of /api/v1/profiles/:id/followers
// Alternatively, we could mount them in profile.routes.ts. Doing it here is fine.
router.get(
  '/followers/:profileId',
  validate(followValidators.profileIdParamSchema.merge(followValidators.paginationQuerySchema)),
  followController.getFollowers
);

router.get(
  '/following/:profileId',
  validate(followValidators.profileIdParamSchema.merge(followValidators.paginationQuerySchema)),
  followController.getFollowing
);

export default router;
