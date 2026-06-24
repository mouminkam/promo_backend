// ============================================
// Promoo Backend — Auth Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class AuthController {
  // ─── Registration ──────────────────────────────────────────────

  async registerEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, full_name, account_type } = req.body;
      const data = await authService.registerWithEmail(email, password, full_name, account_type);
      
      const message = data.session 
        ? 'Registration successful' 
        : 'Registration successful. Please check your email to verify your account.';
        
      apiResponse.created(res, data, message);
    } catch (error) {
      next(error);
    }
  }

  async registerPhone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, password, full_name, account_type } = req.body;
      const data = await authService.registerWithPhone(phone, password, full_name, account_type);
      
      const message = data.session 
        ? 'Registration successful' 
        : 'Registration successful. Please check your phone for OTP.';
        
      apiResponse.created(res, data, message);
    } catch (error) {
      next(error);
    }
  }

  // ─── Login ───────────────────────────────────────────────────

  async loginEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const data = await authService.loginWithEmail(email, password);
      apiResponse.success(res, data, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async loginPhone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, password } = req.body;
      const data = await authService.loginWithPhone(phone, password);
      apiResponse.success(res, data, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  // ─── OTP & Refresh ───────────────────────────────────────────

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, phone, token, type } = req.body;
      const data = await authService.verifyOtp(email, phone, token, type);
      apiResponse.success(res, data, 'OTP verified successfully');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refresh_token } = req.body;
      const data = await authService.refreshToken(refresh_token);
      apiResponse.success(res, data, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  // ─── Password Management ──────────────────────────────────────

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      apiResponse.success(res, null, 'Password reset email sent');
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { password } = req.body;
      const userId = req.user!.id; // Authenticated user ID (requires auth token from reset link)
      
      await authService.resetPassword(password, userId);
      apiResponse.success(res, null, 'Password updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async oauthLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider, id_token, nonce } = req.body;
      const data = await authService.signInWithIdToken(provider, id_token, nonce);
      apiResponse.success(res, data, 'OAuth login successful');
    } catch (error) {
      next(error);
    }
  }

  // ─── Logout ──────────────────────────────────────────────────

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        await authService.logout(token);
      }
      // Return 200 even if there was no token, to clear client state
      apiResponse.success(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  // ─── Delete Account ──────────────────────────────────────────

  async deleteAccount(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await authService.deleteAccount(userId);
      apiResponse.success(res, null, 'Account deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
