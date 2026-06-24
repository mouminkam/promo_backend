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
      
      if (!req.file.mimetype.startsWith('image/')) {
        throw ApiError.badRequest('Invalid file type. Only images are allowed on this route.');
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
      
      if (!req.file.mimetype.startsWith('video/')) {
        throw ApiError.badRequest('Invalid file type. Only videos are allowed on this route.');
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
      
      if (req.file.mimetype.startsWith('image/') || req.file.mimetype.startsWith('video/')) {
        throw ApiError.badRequest('Invalid file type. Images and videos must be uploaded via their specific routes.');
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
      apiResponse.success(res, null, 'File deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
