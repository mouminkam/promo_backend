// ============================================
// Promoo Backend — Saved Items Controller
// ============================================

import { Response, NextFunction } from 'express';
import { savedService } from '../services/saved.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class SavedController {
  async saveItem(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const data = await savedService.saveItem(userId, token, req.body);
      apiResponse.success(res, data, 'Item saved successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getSavedItems(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const data = await savedService.getSavedItems(userId, token);
      apiResponse.success(res, data, 'Saved items retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async unsaveItem(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const savedId = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      await savedService.unsaveItem(savedId, userId, token);
      apiResponse.success(res, null, 'Item removed from saved list');
    } catch (error) {
      next(error);
    }
  }
}

export const savedController = new SavedController();
