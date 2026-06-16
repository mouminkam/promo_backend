// ============================================
// Promoo Backend — Featured Routes
// ============================================

import { Router } from 'express';
import { featuredController } from '../controllers/featured.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { getFeaturedSchema, requestFeaturedSchema } from '../validators/featured.validator';

const router = Router();

// Public route to get featured listings
router.get('/', validate(getFeaturedSchema), featuredController.getFeaturedListings);

// Protected routes
router.use(requireAuth);

router.post(
  '/',
  validate(requestFeaturedSchema),
  featuredController.requestFeatured
);

export default router;
