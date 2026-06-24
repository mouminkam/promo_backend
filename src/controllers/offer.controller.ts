// ============================================
// Promoo Backend — Offer Controller
// ============================================

import { Response, NextFunction } from 'express';
import { offerService } from '../services/offer.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class OfferController {
  /**
   * Create a new offer
   */
  async createOffer(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const payload = req.body;

      const data = await offerService.createOffer(userId, token, payload);
      apiResponse.success(res, data, 'Offer created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing offer
   */
  async updateOffer(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const payload = req.body;

      const data = await offerService.updateOffer(id, userId, token, payload);
      apiResponse.success(res, data, 'Offer updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an offer
   */
  async deleteOffer(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];

      await offerService.deleteOffer(id, userId, token);
      apiResponse.success(res, null, 'Offer deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get details of a single offer (increments views)
   */
  async getOfferById(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const requestingUserId = req.user?.id;

      const data = await offerService.getOfferById(id, requestingUserId);
      apiResponse.success(res, data, 'Offer details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * List offers with pagination and filters
   */
  async getOffers(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const category_id = req.query.category_id as string | undefined;
      const min_price = req.query.min_price ? Number(req.query.min_price) : undefined;
      const max_price = req.query.max_price ? Number(req.query.max_price) : undefined;
      const location = req.query.location as string | undefined;
      const search = req.query.search as string | undefined;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const { data, count } = await offerService.getOffers({
        category_id,
        min_price,
        max_price,
        location,
        search,
        page,
        limit,
      });

      apiResponse.paginated(res, data, count, page, limit, 'Offers retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get offers created by a specific profile
   */
  async getOffersByProfileId(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = req.params.profileId as string;
      const requestingUserId = req.user?.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const { data, count } = await offerService.getOffersByProfileId(profileId, page, limit, requestingUserId);
      apiResponse.paginated(res, data, count, page, limit, 'User offers retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Feature an offer
   */
  async featureOffer(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];

      const data = await offerService.featureOffer(id, userId, token);
      apiResponse.success(res, data, 'Offer featured successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const offerController = new OfferController();
