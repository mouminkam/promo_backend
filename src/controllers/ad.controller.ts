// ============================================
// Promoo Backend — Ad Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { adService } from '../services/ad.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class AdController {
  /**
   * Create a new advertisement
   */
  async createAd(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const payload = req.body;

      const data = await adService.createAd(userId, token, payload);
      apiResponse.success(res, data, 'Ad campaign created successfully. Waiting for activation/payment.', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing advertisement
   */
  async updateAd(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const payload = req.body;

      const data = await adService.updateAd(id, userId, token, payload);
      apiResponse.success(res, data, 'Ad campaign updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle Ad status (Active <-> Paused)
   */
  async toggleAd(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];

      const data = await adService.toggleAd(id, userId, token);
      apiResponse.success(res, data, `Ad status toggled successfully to ${data.status}`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Ad Stats (Impressions, Clicks, Spent, CTR)
   */
  async getAdStats(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      const data = await adService.getAdStats(id, userId);
      apiResponse.success(res, data, 'Ad statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Record Impression (Public endpoint)
   */
  async recordImpression(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;

      const data = await adService.recordImpression(id);
      apiResponse.success(res, { impressions: data.impressions, status: data.status }, 'Ad impression recorded successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Record Click (Public endpoint)
   */
  async recordClick(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;

      const data = await adService.recordClick(id);
      apiResponse.success(res, { clicks: data.clicks, status: data.status, targetUrl: data.target_url }, 'Ad click recorded successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active ads for display (Public endpoint)
   */
  async getActiveAds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adType = req.query.ad_type as string | undefined;

      const data = await adService.getActiveAds(adType);
      apiResponse.success(res, data, 'Active ads retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ads created by a specific user profile (Owner only)
   */
  async getAdsByProfileId(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = req.params.profileId as string;
      const requestingUserId = req.user?.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const { data, count } = await adService.getAdsByProfileId(profileId, page, limit, requestingUserId);
      apiResponse.paginated(res, data, count, page, limit, 'Profile ads campaigns retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adController = new AdController();
