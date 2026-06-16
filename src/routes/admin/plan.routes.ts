// ============================================
// Promoo Backend — Admin Plan Routes
// ============================================

import { Router } from 'express';
import { adminPlanController } from '../../controllers/admin/plan.controller';
import { validate } from '../../middleware/validate.middleware';
import { createPlanSchema, planIdSchema, updatePlanSchema } from '../../validators/admin/plan.validator';

const router = Router();

// Base route: /api/v1/admin/plans

router.get('/', adminPlanController.getPlans);
router.post('/', validate(createPlanSchema), adminPlanController.createPlan);
router.put('/:id', validate(updatePlanSchema), adminPlanController.updatePlan);
router.delete('/:id', validate(planIdSchema), adminPlanController.deletePlan);

export default router;
