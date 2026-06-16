// ============================================
// Promoo Backend — Admin Report Routes
// ============================================

import { Router } from 'express';
import { adminReportController } from '../../controllers/admin/report.controller';
import { validate } from '../../middleware/validate.middleware';
import { getReportsSchema, updateReportStatusSchema } from '../../validators/admin/report.validator';

const router = Router();

// Base route: /api/v1/admin/reports

router.get('/', validate(getReportsSchema), adminReportController.getReports);
router.patch('/:id/status', validate(updateReportStatusSchema), adminReportController.updateReportStatus);

export default router;
