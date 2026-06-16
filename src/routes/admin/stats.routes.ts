// ============================================
// Promoo Backend — Admin Stats Routes
// ============================================

import { Router } from 'express';
import { adminStatsController } from '../../controllers/admin/stats.controller';

const router = Router();

// Base route: /api/v1/admin/stats
router.get('/', adminStatsController.getGlobalStats);

export default router;
