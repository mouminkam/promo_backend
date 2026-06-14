// ============================================
// Promoo Backend — Profile Routes
// ============================================

import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';
import * as profileValidators from '../validators/profile.validator';
import { z } from 'zod'; // Used for simple inline validation

const router = Router();

// ─── Public Routes ───────────────────────────────────────────
// optionalAuth allows the frontend to send a token if available, to tailor the response (e.g., showing 'is_following' status later)
router.get('/:idOrUsername', optionalAuth, profileController.getProfileByIdOrUsername);

// ─── Protected Routes ────────────────────────────────────────
router.use(requireAuth);

router.get('/me', profileController.getOwnProfile);
router.put('/me', validate(profileValidators.updateProfileSchema), profileController.updateOwnProfile);
router.delete('/me', profileController.deleteAccount);

// Avatar & Cover
// Reusing simple schemas for now (can expand later to support Multipart form data)
router.post('/me/avatar', validate(z.object({ body: z.object({ avatarUrl: z.string().url() }) })), profileController.updateAvatar);
router.post('/me/cover', validate(z.object({ body: z.object({ coverUrl: z.string().url() }) })), profileController.updateCover);

// Verification Request
router.post('/me/verify-request', validate(profileValidators.requestVerificationSchema), profileController.requestVerification);

export default router;
