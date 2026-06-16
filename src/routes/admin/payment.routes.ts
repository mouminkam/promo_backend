// ============================================
// Promoo Backend — Admin Payment Routes
// ============================================

import { Router } from 'express';
import { adminPaymentController } from '../../controllers/admin/payment.controller';
import { validate } from '../../middleware/validate.middleware';
import { getPaymentsSchema } from '../../validators/admin/payment.validator';

const router = Router();

// Base route: /api/v1/admin/payments

router.get('/', validate(getPaymentsSchema), adminPaymentController.getPayments);

export default router;
