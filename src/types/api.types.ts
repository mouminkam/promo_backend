// ============================================
// Promoo Backend — API Types
// ============================================
// Shared types used across controllers, services, and responses.

import { Request } from 'express';

// ──────────────────────────────────────────
// Pagination
// ──────────────────────────────────────────

export interface IPaginationQuery {
  page?: number;
  limit?: number;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ──────────────────────────────────────────
// API Response
// ──────────────────────────────────────────

export interface IApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  meta?: IPaginationMeta;
  error?: {
    code: string;
    details?: unknown;
  };
}

// ──────────────────────────────────────────
// Authenticated Request
// ──────────────────────────────────────────

export interface IAuthUser {
  id: string;           // Supabase auth user ID
  email?: string;
  phone?: string;
  role?: string;        // 'authenticated' | 'admin'
}

export interface IAuthRequest extends Request {
  user?: IAuthUser;
  language?: 'ar' | 'en';
}

// ──────────────────────────────────────────
// Service Layer Pagination Params
// ──────────────────────────────────────────

export interface IPaginatedParams {
  page: number;
  limit: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ──────────────────────────────────────────
// Sort & Filter
// ──────────────────────────────────────────

export interface ISortQuery {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
