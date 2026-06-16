// ============================================
// Promoo Backend — Report Routes
// ============================================

import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createReportSchema } from '../validators/report.validator';

const router = Router();

// Only authenticated users can submit reports
router.use(requireAuth);

router.post(
  '/',
  validate(createReportSchema),
  reportController.createReport
);

router.get(
  '/me',
  reportController.getMyReports
);

export default router;
