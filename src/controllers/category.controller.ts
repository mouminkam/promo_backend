// ============================================
// Promoo Backend — Category Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import { apiResponse } from '../utils/apiResponse';

export class CategoryController {
  /**
   * Get all categories
   */
  async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getCategories();
      apiResponse.success(res, categories, 'Categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category content
   */
  async getCategoryContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = req.params.id as string;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await categoryService.getCategoryContent(categoryId, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Category content retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
