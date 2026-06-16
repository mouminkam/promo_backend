// ============================================
// Promoo Backend — Admin User Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { adminUserService } from '../../services/admin/user.service';
import { apiResponse } from '../../utils/apiResponse';

export class AdminUserController {
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      
      const filters = {
        search: req.query.search,
        accountType: req.query.accountType,
        isVerified: req.query.isVerified,
        isActive: req.query.isActive,
      };

      const result = await adminUserService.getUsers(filters, page, limit);
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Users retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getUserDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminUserService.getUserDetails(req.params.id as string);
      apiResponse.success(res, result, 'User details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async toggleBan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isActive } = req.body;
      const result = await adminUserService.toggleBan(req.params.id as string, isActive);
      apiResponse.success(res, result, `User status updated to ${isActive ? 'active' : 'banned'}`);
    } catch (error) {
      next(error);
    }
  }

  async toggleVerify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isVerified } = req.body;
      const result = await adminUserService.toggleVerify(req.params.id as string, isVerified);
      apiResponse.success(res, result, `User verification status updated to ${isVerified}`);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminUserService.deleteUser(req.params.id as string);
      apiResponse.success(res, null, 'User deleted permanently');
    } catch (error) {
      next(error);
    }
  }
}

export const adminUserController = new AdminUserController();
