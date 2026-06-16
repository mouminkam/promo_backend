// ============================================
// Promoo Backend — Report Controller
// ============================================

import { Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class ReportController {
  /**
   * Submit a new report
   */
  async createReport(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await reportService.createReport(req.user!.id, req.body);
      apiResponse.created(res, result, 'Report submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get my reports
   */
  async getMyReports(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await reportService.getMyReports(req.user!.id, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Reports retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
