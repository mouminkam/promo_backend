// ============================================
// Promoo Backend — Story Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { storyService } from '../services/story.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class StoryController {
  async createStory(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const data = await storyService.createStory(userId, token, req.body);
      apiResponse.success(res, data, 'Story created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getActiveStories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await storyService.getActiveStories();
      apiResponse.success(res, data, 'Active stories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyStories(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await storyService.getMyStories(userId);
      apiResponse.success(res, data, 'Your stories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserStories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const data = await storyService.getUserStories(userId);
      apiResponse.success(res, data, 'User stories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteStory(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      await storyService.deleteStory(storyId, userId, token);
      apiResponse.success(res, null, 'Story deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const storyController = new StoryController();
