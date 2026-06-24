// ============================================
// Promoo Backend — Offer Routes
// ============================================

import { Router } from 'express';
import { offerController } from '../controllers/offer.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';
import { requireAccountType } from '../middleware/accountType.middleware';
import * as offerValidators from '../validators/offer.validator';

const router = Router();

// ─── Public Routes ───────────────────────────────────────────
router.get(
  '/',
  optionalAuth,
  validate(offerValidators.getOffersQuerySchema),
  offerController.getOffers
);

router.get(
  '/:id',
  optionalAuth,
  validate(offerValidators.offerIdParamSchema),
  offerController.getOfferById
);

router.get(
  '/profile/:profileId',
  optionalAuth,
  offerController.getOffersByProfileId
);

// ─── Protected Routes ────────────────────────────────────────
router.use(requireAuth);

router.post(
  '/',
  validate(offerValidators.createOfferSchema),
  requireAccountType(['company', 'service_provider']),
  offerController.createOffer
);

router.put(
  '/:id',
  validate(offerValidators.updateOfferSchema),
  offerController.updateOffer
);

router.delete(
  '/:id',
  validate(offerValidators.offerIdParamSchema),
  offerController.deleteOffer
);

router.post(
  '/:id/feature',
  validate(offerValidators.offerIdParamSchema),
  offerController.featureOffer
);

export default router;
