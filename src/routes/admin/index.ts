// ============================================
// Promoo Backend — Admin Routes Entry Point
// ============================================

import { Router } from 'express';
import { requireAdmin } from '../../middleware/admin.middleware';

// Import all admin modules
import statsRoutes from './stats.routes';
import userRoutes from './user.routes';
import contentRoutes from './content.routes';
import planRoutes from './plan.routes';
import paymentRoutes from './payment.routes';
import reportRoutes from './report.routes';
import categoryRoutes from './category.routes';

const router = Router();

// Protect ALL admin routes with the requireAdmin middleware
// requireAdmin already uses requireAuth internally to verify the token first
router.use(requireAdmin);

// Mount Admin Modules
router.use('/stats', statsRoutes);
router.use('/users', userRoutes);
router.use('/content', contentRoutes);
router.use('/plans', planRoutes);
router.use('/payments', paymentRoutes);
router.use('/reports', reportRoutes);
router.use('/categories', categoryRoutes);

export default router;
