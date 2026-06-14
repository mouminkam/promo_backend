// ============================================
// Promoo Backend — Follow Controller
// ============================================

import { Response, NextFunction } from 'express';
import { followService } from '../services/follow.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class FollowController {

  async followProfile(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const followerId = req.user!.id;
      const followingId = req.params.profileId as string;
      const token = req.headers.authorization!.split(' ')[1];

      await followService.followProfile(followerId, followingId, token);
      apiResponse.success(res, null, 'Successfully followed profile');
    } catch (error) {
      next(error);
    }
  }

  async unfollowProfile(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const followerId = req.user!.id;
      const followingId = req.params.profileId as string;
      const token = req.headers.authorization!.split(' ')[1];

      await followService.unfollowProfile(followerId, followingId, token);
      apiResponse.success(res, null, 'Successfully unfollowed profile');
    } catch (error) {
      next(error);
    }
  }

  async checkFollowStatus(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const followerId = req.user!.id;
      const followingId = req.params.profileId as string;

      const data = await followService.checkFollowStatus(followerId, followingId);
      apiResponse.success(res, data, 'Status retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getFollowers(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = req.params.profileId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const { data, count } = await followService.getFollowers(profileId, page, limit);
      apiResponse.paginated(res, data, count, page, limit, 'Followers retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getFollowing(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = req.params.profileId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const { data, count } = await followService.getFollowing(profileId, page, limit);
      apiResponse.paginated(res, data, count, page, limit, 'Following retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const followController = new FollowController();
