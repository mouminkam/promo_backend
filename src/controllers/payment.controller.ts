// ============================================
// Promoo Backend — Payment Controller
// ============================================

import { Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class PaymentController {
  /**
   * Get my payment history
   */
  async getMyPayments(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await paymentService.getMyPayments(req.user!.id, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Payments retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get specific payment details
   */
  async getPaymentDetails(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentId = req.params.id as string;
      const result = await paymentService.getPaymentDetails(req.user!.id, paymentId);
      apiResponse.success(res, result, 'Payment details retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a Stripe Customer Portal session
   */
  async createCustomerPortalSession(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await paymentService.createCustomerPortalSession(req.user!.id);
      apiResponse.success(res, result, 'Portal session created');
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
