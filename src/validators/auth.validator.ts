// ============================================
// Promoo Backend — Auth Validators
// ============================================

import { z } from 'zod';
import { AccountType } from '../types/enums';

export const registerEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    full_name: z.string().min(2, 'Full name is too short'),
    account_type: z.nativeEnum(AccountType).default(AccountType.User),
  }),
});

export const registerPhoneSchema = z.object({
  body: z.object({
    phone: z.string().min(10, 'Invalid phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    full_name: z.string().min(2, 'Full name is too short'),
    account_type: z.nativeEnum(AccountType).default(AccountType.User),
  }),
});

export const loginEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const loginPhoneSchema = z.object({
  body: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    token: z.string().length(6, 'OTP must be 6 digits'),
    type: z.enum(['signup', 'magiclink', 'recovery', 'sms']),
  }).refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
    path: ['email'],
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(1, 'Refresh token is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

export const oauthIdTokenSchema = z.object({
  body: z.object({
    provider: z.enum(['google', 'apple']),
    id_token: z.string().min(1, 'ID Token is required'),
    nonce: z.string().optional(),
  }),
});
