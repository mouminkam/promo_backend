// ============================================
// Promoo Backend — Upload Routes
// ============================================

import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { upload } from '../middleware/upload.middleware';
import { deleteFileSchema, uploadMediaSchema } from '../validators/upload.validator';

const router = Router();

// All upload routes require authentication
router.use(requireAuth);

router.post(
  '/image',
  upload.single('file'),
  validate(uploadMediaSchema),
  uploadController.uploadImage
);

router.post(
  '/video',
  upload.single('file'),
  validate(uploadMediaSchema),
  uploadController.uploadVideo
);

router.post(
  '/file',
  upload.single('file'),
  validate(uploadMediaSchema),
  uploadController.uploadFile
);

router.delete(
  '/:fileId',
  validate(deleteFileSchema),
  uploadController.deleteFile
);

export default router;
