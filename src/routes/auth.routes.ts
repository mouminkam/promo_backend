// ============================================
// Promoo Backend — Auth Routes
// ============================================

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import * as authValidators from '../validators/auth.validator';

const router = Router();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

// ─── Registration ──────────────────────────────────────────────
router.post('/register/email', validate(authValidators.registerEmailSchema), authController.registerEmail);
router.post('/register/phone', validate(authValidators.registerPhoneSchema), authController.registerPhone);

// ─── Login ───────────────────────────────────────────────────
router.post('/login/email', validate(authValidators.loginEmailSchema), authController.loginEmail);
router.post('/login/phone', validate(authValidators.loginPhoneSchema), authController.loginPhone);
router.post('/login/oauth', validate(authValidators.oauthIdTokenSchema), authController.oauthLogin);

// ─── OTP & Refresh ───────────────────────────────────────────
router.post('/verify-otp', validate(authValidators.verifyOtpSchema), authController.verifyOtp);
router.post('/refresh', validate(authValidators.refreshTokenSchema), authController.refreshToken);

// ─── Password Management ──────────────────────────────────────
router.post('/forgot-password', validate(authValidators.forgotPasswordSchema), authController.forgotPassword);
// The reset-password requires the user to be authenticated (they send the token obtained from the reset email)
router.post('/reset-password', requireAuth, validate(authValidators.resetPasswordSchema), authController.resetPassword);

// ─── Logout ──────────────────────────────────────────────────
router.post('/logout', authController.logout);

export default router;
