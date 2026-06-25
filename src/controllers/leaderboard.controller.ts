// ============================================
// Promoo Backend — Leaderboard (Cup) Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { leaderboardService } from '../services/leaderboard.service';
import { apiResponse } from '../utils/apiResponse';

export class LeaderboardController {
  /**
   * GET /leaderboard — the Cup ranking
   */
  async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const type = ((req.query.type as string) || 'all') as
        | 'all'
        | 'company'
        | 'influencer'
        | 'service_provider';

      const result = await leaderboardService.getLeaderboard({ page, limit, type });
      apiResponse.paginated(
        res,
        result.data,
        result.total,
        result.page,
        result.limit,
        'Leaderboard retrieved'
      );
    } catch (error) {
      next(error);
    }
  }
}

export const leaderboardController = new LeaderboardController();
