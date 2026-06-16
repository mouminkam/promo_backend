// ============================================
// Promoo Backend — Admin Content Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { adminContentService } from '../../services/admin/content.service';
import { apiResponse } from '../../utils/apiResponse';

export class AdminContentController {
  // --- Offers ---
  async updateOfferStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const result = await adminContentService.updateOfferStatus(req.params.id as string, status);
      apiResponse.success(res, result, `Offer status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }

  async deleteOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminContentService.deleteOffer(req.params.id as string);
      apiResponse.success(res, null, 'Offer deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // --- Ads ---
  async updateAdStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const result = await adminContentService.updateAdStatus(req.params.id as string, status);
      apiResponse.success(res, result, `Ad status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }

  async deleteAd(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminContentService.deleteAd(req.params.id as string);
      apiResponse.success(res, null, 'Ad deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adminContentController = new AdminContentController();
