// ============================================
// Promoo Backend — Leaderboard (Cup) Routes
// ============================================

import { Router } from 'express';
import { leaderboardController } from '../controllers/leaderboard.controller';
import { validate } from '../middleware/validate.middleware';
import { leaderboardQuerySchema } from '../validators/leaderboard.validator';

const router = Router();

// Public route — the Cup leaderboard feed
router.get('/', validate(leaderboardQuerySchema), leaderboardController.getLeaderboard);

export default router;
