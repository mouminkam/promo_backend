// ============================================
// Promoo Backend — Admin Category Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { adminCategoryService } from '../../services/admin/category.service';
import { apiResponse } from '../../utils/apiResponse';

export class AdminCategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminCategoryService.createCategory(req.body);
      apiResponse.created(res, result, 'Category created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminCategoryService.updateCategory(req.params.id as string, req.body);
      apiResponse.success(res, result, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminCategoryService.deleteCategory(req.params.id as string);
      apiResponse.success(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adminCategoryController = new AdminCategoryController();
