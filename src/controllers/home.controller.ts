// ============================================
// Promoo Backend — Home Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { homeService } from '../services/home.service';
import { apiResponse } from '../utils/apiResponse';

export class HomeController {
  async getHomeFeed(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await homeService.getHomeFeed();
      apiResponse.success(res, data, 'Home feed retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const homeController = new HomeController();
