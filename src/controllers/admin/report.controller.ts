// ============================================
// Promoo Backend — Admin Report Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { adminReportService } from '../../services/admin/report.service';
import { apiResponse } from '../../utils/apiResponse';

export class AdminReportController {
  async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const filters = {
        status: req.query.status,
        type: req.query.type,
      };

      const result = await adminReportService.getReports(filters, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Reports retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateReportStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, admin_note } = req.body;
      const result = await adminReportService.updateReportStatus(req.params.id as string, status, admin_note);
      apiResponse.success(res, result, `Report status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }
}

export const adminReportController = new AdminReportController();
