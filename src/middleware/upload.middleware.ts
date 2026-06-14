// ============================================
// Promoo Backend — File Upload Middleware (Multer)
// ============================================
// Configures Multer for handling multipart/form-data file uploads.
// Files are stored in memory temporarily before being sent to Supabase Storage.

import multer from 'multer';
import { ApiError } from '../utils/apiError';

// Allowed MIME types
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const ALL_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES, 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;   // 10MB

/**
 * Image upload — max 5MB, common image formats only.
 */
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(ApiError.badRequest(`Invalid image type: ${file.mimetype}. Allowed: jpg, png, webp, gif`));
    }
  },
});

/**
 * Video upload — max 50MB, common video formats.
 */
export const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VIDEO_SIZE },
  fileFilter: (_req, file, cb) => {
    if (VIDEO_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(ApiError.badRequest(`Invalid video type: ${file.mimetype}. Allowed: mp4, mov, webm`));
    }
  },
});

/**
 * General file upload — max 10MB, images + videos + documents.
 */
export const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALL_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
    }
  },
});
