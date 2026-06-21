// ============================================
// Promoo Backend — Global Error Handler Middleware
// ============================================
// Catches all errors thrown by controllers/services and returns
// a consistent JSON response. Must be the LAST middleware registered.

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { apiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { ErrorCode } from '../types/enums';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // If it's our custom ApiError, use its fields
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error({ err, statusCode: err.statusCode }, err.message);
    } else {
      logger.warn({ statusCode: err.statusCode, errorCode: err.errorCode }, err.message);
    }

    require("fs").writeFileSync("scratch/api_error.log", String(err.stack || err)); apiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.errorCode,
      err.details
    );
    return;
  }

  // Unexpected errors — log full stack, return generic message
  logger.error({ err }, 'Unhandled error');

  apiResponse.error(
    res,
    'An unexpected error occurred',
    500,
    ErrorCode.INTERNAL_ERROR
  );
}
