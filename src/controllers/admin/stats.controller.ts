// ============================================
// Promoo Backend — Admin Stats Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { adminStatsService } from '../../services/admin/stats.service';
import { apiResponse } from '../../utils/apiResponse';

export class AdminStatsController {
  async getGlobalStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await adminStatsService.getGlobalStats();
      apiResponse.success(res, stats, 'Global statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adminStatsController = new AdminStatsController();
