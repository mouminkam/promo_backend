// ============================================
// Promoo Backend — API Response Helper
// ============================================
// Ensures ALL responses follow the same format.

import { Response } from 'express';
import { IApiResponse, IPaginationMeta } from '../types/api.types';

class ApiResponse {
  /**
   * Send a success response
   */
  success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200, meta?: IPaginationMeta): Response {
    const response: IApiResponse<T> = {
      success: true,
      data,
      message,
      ...(meta && { meta }),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  created<T>(res: Response, data: T, message: string = 'Created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  /**
   * Send a no-content response (204)
   */
  noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Send a paginated success response
   */
  paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Success'
  ): Response {
    const totalPages = Math.ceil(total / limit);
    return this.success(res, data, message, 200, {
      page,
      limit,
      total,
      totalPages,
    });
  }

  /**
   * Send an error response
   */
  error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    details?: unknown
  ): Response {
    const response: IApiResponse<null> = {
      success: false,
      data: null,
      message,
      error: {
        code: errorCode || 'INTERNAL_ERROR',
        ...(details ? { details } : {}),
      },
    };
    return res.status(statusCode).json(response);
  }
}

export const apiResponse = new ApiResponse();
