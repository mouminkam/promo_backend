// ============================================
// Promoo Backend — Admin Payment Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { adminPaymentService } from '../../services/admin/payment.service';
import { apiResponse } from '../../utils/apiResponse';

export class AdminPaymentController {
  async getPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const filters = {
        status: req.query.status,
        type: req.query.type,
      };

      const result = await adminPaymentService.getPayments(filters, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Payments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adminPaymentController = new AdminPaymentController();
