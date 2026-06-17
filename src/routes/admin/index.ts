// ============================================
// Promoo Backend — Admin Routes Entry Point
// ============================================

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
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

// Protect ALL admin routes
// requireAuth parses the token and sets req.user, requireAdmin checks the is_admin flag
router.use(requireAuth, requireAdmin);

// Mount Admin Modules
router.use('/stats', statsRoutes);
router.use('/users', userRoutes);
router.use('/content', contentRoutes);
router.use('/plans', planRoutes);
router.use('/payments', paymentRoutes);
router.use('/reports', reportRoutes);
router.use('/categories', categoryRoutes);

export default router;
