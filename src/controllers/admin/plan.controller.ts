// ============================================
// Promoo Backend — Admin Plan Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { adminPlanService } from '../../services/admin/plan.service';
import { apiResponse } from '../../utils/apiResponse';

export class AdminPlanController {
  async getPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminPlanService.getPlans();
      apiResponse.success(res, result, 'Subscription plans retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminPlanService.createPlan(req.body);
      apiResponse.created(res, result, 'Subscription plan created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminPlanService.updatePlan(req.params.id as string, req.body);
      apiResponse.success(res, result, 'Subscription plan updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminPlanService.deletePlan(req.params.id as string);
      apiResponse.success(res, null, 'Subscription plan deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adminPlanController = new AdminPlanController();
