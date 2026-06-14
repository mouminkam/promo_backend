// ============================================
// Promoo Backend — Subscription Routes
// ============================================

import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import * as subscriptionValidators from '../validators/subscription.validator';

const router = Router();

// ─── Public Routes ───────────────────────────────────────────
router.get(
  '/plans',
  subscriptionController.getPlans
);

// ─── Protected Routes ────────────────────────────────────────
router.use(requireAuth);

router.post(
  '/',
  validate(subscriptionValidators.createSubscriptionSchema),
  subscriptionController.createSubscription
);

router.get(
  '/me',
  subscriptionController.getMySubscription
);

router.post(
  '/manage',
  subscriptionController.manageSubscription
);

export default router;
