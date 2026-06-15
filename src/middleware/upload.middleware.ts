// ============================================
// Promoo Backend — Upload Middleware (Multer)
// ============================================

import multer from 'multer';
import { ApiError } from '../utils/apiError';

// Use memory storage so we can upload the buffer directly to Supabase Storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max limit for videos, images usually smaller
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      // Images
      'image/jpeg', 
      'image/png', 
      'image/webp',
      'image/gif',
      // Videos
      'video/mp4', 
      'video/quicktime',
      'video/webm',
      // Documents
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // @ts-ignore
      cb(new ApiError(400, 'Invalid file type. Only images, videos, and standard documents are allowed.'), false);
    }
  }
});
