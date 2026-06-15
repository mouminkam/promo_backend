// ============================================
// Promoo Backend — Upload Controller
// ============================================

import { Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';
import { ApiError } from '../utils/apiError';

export class UploadController {
  /**
   * Upload an Image
   */
  async uploadImage(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw ApiError.badRequest('No image file provided');
      }

      const { related_to, related_id } = req.body;
      const bucket = req.body.bucket || 'general'; // Allow client to specify bucket (e.g., 'avatars', 'offers')

      const result = await uploadService.uploadFile(
        req.user!.id,
        req.file,
        bucket,
        related_to,
        related_id
      );

      apiResponse.created(res, result, 'Image uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload a Video
   */
  async uploadVideo(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw ApiError.badRequest('No video file provided');
      }

      const { related_to, related_id } = req.body;
      const bucket = req.body.bucket || 'general';

      const result = await uploadService.uploadFile(
        req.user!.id,
        req.file,
        bucket,
        related_to,
        related_id
      );

      apiResponse.created(res, result, 'Video uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload a File/Document
   */
  async uploadFile(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw ApiError.badRequest('No file provided');
      }

      const { related_to, related_id } = req.body;
      const bucket = req.body.bucket || 'general';

      const result = await uploadService.uploadFile(
        req.user!.id,
        req.file,
        bucket,
        related_to,
        related_id
      );

      apiResponse.created(res, result, 'File uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a File
   */
  async deleteFile(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const fileId = req.params.fileId as string;
      await uploadService.deleteFile(req.user!.id, fileId);
      apiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
