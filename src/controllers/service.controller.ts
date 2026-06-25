// ============================================
// Promoo Backend — Service Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/service.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class ServiceController {
  async getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const categoryId = (req.query.categoryId as string | undefined) || (req.query.category_id as string | undefined);
      const q = req.query.q as string | undefined;

      const result = await serviceService.getServices({ page, limit, categoryId, q });
      apiResponse.paginated(res, result.data, result.total, result.page, result.limit, 'Services retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const serviceId = req.params.id as string;
      const data = await serviceService.getServiceById(serviceId);
      apiResponse.success(res, data, 'Service retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createService(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const data = await serviceService.createService(userId, token, req.body);
      apiResponse.success(res, data, 'Service created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateService(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const serviceId = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const data = await serviceService.updateService(serviceId, userId, token, req.body);
      apiResponse.success(res, data, 'Service updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const serviceId = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      await serviceService.deleteService(serviceId, userId, token);
      apiResponse.success(res, null, 'Service deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const serviceController = new ServiceController();
