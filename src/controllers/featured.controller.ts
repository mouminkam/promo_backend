// ============================================
// Promoo Backend — Featured Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { featuredService } from '../services/featured.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class FeaturedController {
  /**
   * Create a checkout session for featured placement
   */
  async requestFeatured(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { placement, durationDays } = req.body;
      const result = await featuredService.requestFeatured(req.user!.id, placement, durationDays);
      apiResponse.success(res, result, 'Featured checkout session created');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active featured listings
   */
  async getFeaturedListings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const placement = req.query.placement as string | undefined;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await featuredService.getFeaturedListings(placement, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Featured listings retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const featuredController = new FeaturedController();
