// ============================================
// Promoo Backend — Auth Service
// ============================================

import { supabaseAdmin, supabaseAuth } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import { AccountType } from '../types/enums';

export class AuthService {
  /**
   * Register with Email and Password
   */
  async registerWithEmail(email: string, password: string, fullName: string, accountType: AccountType) {
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          account_type: accountType,
        },
      },
    });

    if (error) {
      throw ApiError.badRequest(error.message);
    }
    return data;
  }

  /**
   * Register with Phone and Password
   */
  async registerWithPhone(phone: string, password: string, fullName: string, accountType: AccountType) {
    const { data, error } = await supabaseAuth.auth.signUp({
      phone,
      password,
      options: {
        data: {
          full_name: fullName,
          account_type: accountType,
        },
      },
    });

    if (error) {
      throw ApiError.badRequest(error.message);
    }
    return data;
  }

  /**
   * Login with Email
   */
  async loginWithEmail(email: string, password: string) {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw ApiError.unauthorized(error.message);
    }

    // Check if user is banned
    if (data.user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('is_active')
        .eq('id', data.user.id)
        .single();
        
      if (profile && profile.is_active === false) {
        throw ApiError.unauthorized('Account is banned');
      }
    }

    return data;
  }

  /**
   * Login with Phone
   */
  async loginWithPhone(phone: string, password: string) {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) {
      throw ApiError.unauthorized(error.message);
    }

    // Check if user is banned
    if (data.user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('is_active')
        .eq('id', data.user.id)
        .single();
        
      if (profile && profile.is_active === false) {
        throw ApiError.unauthorized('Account is banned');
      }
    }

    return data;
  }

  /**
   * Verify OTP (for email signup, phone signup, or password recovery)
   */
  async verifyOtp(email: string | undefined, phone: string | undefined, token: string, type: any) {
    const payload: any = { token, type };
    if (email) payload.email = email;
    if (phone) payload.phone = phone;

    const { data, error } = await supabaseAuth.auth.verifyOtp(payload);

    if (error) {
      throw ApiError.badRequest(error.message);
    }
    return data;
  }

  /**
   * Refresh Token
   */
  async refreshToken(refresh_token: string) {
    const { data, error } = await supabaseAuth.auth.refreshSession({ refresh_token });

    if (error) {
      throw ApiError.unauthorized(error.message);
    }
    return data;
  }

  /**
   * Logout (Invalidate token)
   */
  async logout(token: string) {
    const { error } = await supabaseAdmin.auth.admin.signOut(token);
    if (error) {
      throw ApiError.internal(error.message);
    }
    return true;
  }

  /**
   * Send Password Reset Email
   */
  async forgotPassword(email: string) {
    const { error } = await supabaseAuth.auth.resetPasswordForEmail(email);
    if (error) {
      throw ApiError.badRequest(error.message);
    }
    return true;
  }

  /**
   * Update Password (requires auth user)
   */
  async resetPassword(password: string, userId: string) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
    });
    
    if (error) {
      throw ApiError.badRequest(error.message);
    }
    return true;
  }

  /**
   * OAuth Login (ID Token from Mobile App)
   */
  async signInWithIdToken(provider: 'google' | 'apple', idToken: string, nonce?: string) {
    const { data, error } = await supabaseAuth.auth.signInWithIdToken({
      provider,
      token: idToken,
      nonce,
    });

    if (error) {
      throw ApiError.unauthorized(error.message);
    }
    return data;
  }
}

export const authService = new AuthService();
