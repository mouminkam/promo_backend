// ============================================
// Promoo Backend — Search Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { searchService } from '../services/search.service';
import { apiResponse } from '../utils/apiResponse';

export class SearchController {
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = {
        q: req.query.q as string | undefined,
        type: req.query.type as 'profiles' | 'offers' | 'ads' | 'all' | undefined,
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 20,
        categoryId: req.query.categoryId as string | undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        location: req.query.location as string | undefined,
        accountType: req.query.accountType as 'company' | 'influencer' | 'service_provider' | 'user' | undefined,
      };

      const result = await searchService.search(params);

      if (params.type === 'all') {
        apiResponse.success(res, result, 'Search results retrieved');
      } else {
        // @ts-ignore - We know it has pagination when type !== 'all'
        apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Search results retrieved');
      }
    } catch (error) {
      next(error);
    }
  }
}

export const searchController = new SearchController();
