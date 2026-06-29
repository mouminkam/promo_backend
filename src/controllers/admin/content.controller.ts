// ============================================
// Promoo Backend — Admin Content Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { adminContentService } from '../../services/admin/content.service';
import { apiResponse } from '../../utils/apiResponse';

function pageParams(req: Request) {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const status = (req.query.status as string) || undefined;
  return { page, limit, status };
}

export class AdminContentController {
  // --- Moderation lists ---
  async listOffers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, status } = pageParams(req);
      const { data, count } = await adminContentService.listOffers(page, limit, status);
      apiResponse.paginated(res, data, count, page, limit, 'Offers retrieved');
    } catch (error) {
      next(error);
    }
  }

  async listAds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, status } = pageParams(req);
      const { data, count } = await adminContentService.listAds(page, limit, status);
      apiResponse.paginated(res, data, count, page, limit, 'Ads retrieved');
    } catch (error) {
      next(error);
    }
  }

  async listServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, status } = pageParams(req);
      const { data, count } = await adminContentService.listServices(page, limit, status);
      apiResponse.paginated(res, data, count, page, limit, 'Services retrieved');
    } catch (error) {
      next(error);
    }
  }

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
