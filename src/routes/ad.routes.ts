// ============================================
// Promoo Backend — Ad Routes
// ============================================

import { Router } from 'express';
import { adController } from '../controllers/ad.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import * as adValidators from '../validators/ad.validator';

const router = Router();

// ─── Public Routes ───────────────────────────────────────────
router.get(
  '/active',
  adController.getActiveAds
);

router.post(
  '/:id/impression',
  validate(adValidators.adIdParamSchema),
  adController.recordImpression
);

router.post(
  '/:id/click',
  validate(adValidators.adIdParamSchema),
  adController.recordClick
);

// ─── Protected Routes ────────────────────────────────────────
router.use(requireAuth);

router.post(
  '/',
  validate(adValidators.createAdSchema),
  adController.createAd
);

router.put(
  '/:id',
  validate(adValidators.updateAdSchema),
  adController.updateAd
);

router.patch(
  '/:id/toggle',
  validate(adValidators.adIdParamSchema),
  adController.toggleAd
);

router.get(
  '/:id/stats',
  validate(adValidators.adIdParamSchema),
  adController.getAdStats
);

router.get(
  '/profile/:profileId',
  adController.getAdsByProfileId
);

export default router;
