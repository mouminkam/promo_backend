// ============================================
// Promoo Backend — Admin Content Routes
// ============================================

import { Router } from 'express';
import { adminContentController } from '../../controllers/admin/content.controller';
import { validate } from '../../middleware/validate.middleware';
import { idParamSchema, updateStatusSchema, listContentSchema } from '../../validators/admin/content.validator';

const router = Router();

// Base route: /api/v1/admin/content

// --- Moderation lists (all statuses, paginated, with owner) ---
router.get('/offers', validate(listContentSchema), adminContentController.listOffers);
router.get('/ads', validate(listContentSchema), adminContentController.listAds);
router.get('/services', validate(listContentSchema), adminContentController.listServices);

// --- Offers ---
router.patch('/offers/:id/status', validate(updateStatusSchema), adminContentController.updateOfferStatus);
router.delete('/offers/:id', validate(idParamSchema), adminContentController.deleteOffer);

// --- Ads ---
router.patch('/ads/:id/status', validate(updateStatusSchema), adminContentController.updateAdStatus);
router.delete('/ads/:id', validate(idParamSchema), adminContentController.deleteAd);

export default router;
