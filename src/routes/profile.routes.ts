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

// ─── Protected Routes (Explicit Paths First) ─────────────────
// We apply requireAuth directly to these so they are protected
router.get('/me', requireAuth, profileController.getOwnProfile);
router.put('/me', requireAuth, validate(profileValidators.updateProfileSchema), profileController.updateOwnProfile);
router.delete('/me', requireAuth, profileController.deleteAccount);

// Avatar & Cover
router.post('/me/avatar', requireAuth, validate(z.object({ body: z.object({ avatar_url: z.string().url() }) })), profileController.updateAvatar);
router.post('/me/cover', requireAuth, validate(z.object({ body: z.object({ cover_url: z.string().url() }) })), profileController.updateCover);

// Verification Request
router.post('/me/verify-request', requireAuth, validate(profileValidators.requestVerificationSchema), profileController.requestVerification);

// ─── Public Routes (Dynamic Params Last) ─────────────────────
// optionalAuth allows the frontend to send a token if available, to tailor the response
router.get('/:idOrUsername', optionalAuth, profileController.getProfileByIdOrUsername);

export default router;
