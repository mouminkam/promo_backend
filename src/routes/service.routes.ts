// ============================================
// Promoo Backend — Service Routes
// ============================================

import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAccountType } from '../middleware/accountType.middleware';
import * as serviceValidators from '../validators/service.validator';

const router = Router();

// Public routes
router.get('/', serviceController.getServices);

router.get(
  '/:id',
  validate(serviceValidators.serviceIdParamSchema),
  serviceController.getServiceById
);

// Protected routes (Service Providers and Companies only)
router.use(requireAuth);
router.use(requireAccountType(['service_provider', 'company']));

router.post(
  '/',
  validate(serviceValidators.createServiceSchema),
  serviceController.createService
);

router.put(
  '/:id',
  validate(serviceValidators.serviceIdParamSchema),
  validate(serviceValidators.updateServiceSchema),
  serviceController.updateService
);

router.delete(
  '/:id',
  validate(serviceValidators.serviceIdParamSchema),
  serviceController.deleteService
);

export default router;
