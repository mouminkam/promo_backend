// ============================================
// Promoo Backend — Profile Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class ProfileController {
  
  // ─── Read Profiles ───────────────────────────────────────────

  async getOwnProfile(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await profileService.getProfileById(userId);
      apiResponse.success(res, data, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getProfileByIdOrUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrUsername = req.params.idOrUsername as string;
      
      // If it looks like a UUID, search by ID, else search by Username
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrUsername);
      
      const data = isUuid 
        ? await profileService.getProfileById(idOrUsername)
        : await profileService.getProfileByUsername(idOrUsername);
        
      apiResponse.success(res, data, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getProfileMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = req.params.id as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const { data, count } = await profileService.getProfileMedia(profileId, page, limit);
      apiResponse.paginated(res, data, count, page, limit, 'Profile media retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // ─── Update Profiles ─────────────────────────────────────────

  async updateOwnProfile(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const data = await profileService.updateProfile(userId, token, req.body);
      apiResponse.success(res, data, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const { avatar_url } = req.body; // In a real app, you might use Multer + Supabase Storage upload service here
      const data = await profileService.updateAvatar(userId, token, avatar_url);
      apiResponse.success(res, data, 'Avatar updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateCover(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const { cover_url } = req.body;
      const data = await profileService.updateCover(userId, token, cover_url);
      apiResponse.success(res, data, 'Cover updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // ─── Verification & Account Management ───────────────────────

  async requestVerification(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { document_url, notes } = req.body;
      await profileService.requestVerification(userId, document_url, notes);
      apiResponse.success(res, null, 'Verification requested successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const profileController = new ProfileController();
