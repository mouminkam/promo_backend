// ============================================
// Promoo Backend — Custom API Error Classes
// ============================================
// Throw these in services — the error handler middleware catches them.

import { ErrorCode } from '../types/enums';

export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: unknown;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = ErrorCode.INTERNAL_ERROR,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true; // Operational errors (expected) vs programming errors

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // ─── Factory Methods ──────────────────────

  static badRequest(message: string = 'Bad request', details?: unknown): ApiError {
    return new ApiError(message, 400, ErrorCode.VALIDATION_ERROR, details);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, 401, ErrorCode.UNAUTHORIZED);
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(message, 403, ErrorCode.FORBIDDEN);
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(message, 404, ErrorCode.NOT_FOUND);
  }

  static conflict(message: string = 'Resource already exists'): ApiError {
    return new ApiError(message, 409, ErrorCode.ALREADY_EXISTS);
  }

  static tooManyRequests(message: string = 'Too many requests'): ApiError {
    return new ApiError(message, 429, ErrorCode.RATE_LIMIT_EXCEEDED);
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(message, 500, ErrorCode.INTERNAL_ERROR);
  }

  static paymentRequired(message: string = 'Payment required'): ApiError {
    return new ApiError(message, 402, ErrorCode.PAYMENT_REQUIRED);
  }
}
