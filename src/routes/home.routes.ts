// ============================================
// Promoo Backend — Home Routes
// ============================================

import { Router } from 'express';
import { homeController } from '../controllers/home.controller';

const router = Router();

// Public route for the home feed
router.get('/', homeController.getHomeFeed);

export default router;
