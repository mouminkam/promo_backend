// ============================================
// Promoo Backend — Payment Routes
// ============================================

import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { getPaymentDetailsSchema, getPaymentsSchema } from '../validators/payment.validator';

const router = Router();

// All payment routes require authentication
router.use(requireAuth);

router.get(
  '/history',
  validate(getPaymentsSchema),
  paymentController.getMyPayments
);

router.post(
  '/portal',
  paymentController.createCustomerPortalSession
);

router.get(
  '/:id',
  validate(getPaymentDetailsSchema),
  paymentController.getPaymentDetails
);

export default router;
