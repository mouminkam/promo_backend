// ============================================
// Promoo Backend — Validation Middleware
// ============================================
// Generic middleware that validates req.body, req.query, and req.params
// against a Zod schema. Returns 400 with field-level errors on failure.

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { apiResponse } from '../utils/apiResponse';
import { ErrorCode } from '../types/enums';

/**
 * Factory function that creates a validation middleware from a Zod schema.
 *
 * Usage:
 *   const schema = z.object({
 *     body: z.object({ email: z.string().email() }),
 *     params: z.object({ id: z.string().uuid() }),
 *   });
 *   router.post('/users/:id', validate(schema), controller);
 */
export function validate(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      const validated = validatedData as any;

      // Mutate the request objects with validated/transformed data
      if (validated.body) Object.assign(req.body, validated.body);
      if (validated.query) Object.assign(req.query, validated.query);
      if (validated.params) Object.assign(req.params, validated.params);

      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === 'ZodError') {
        const issues = error.issues || error.errors || [];
        const formattedErrors = issues.map((err: any) => ({
          field: err.path ? err.path.join('.') : 'unknown',
          message: err.message,
        }));

        apiResponse.error(
          res,
          'Validation failed',
          400,
          ErrorCode.VALIDATION_ERROR,
          formattedErrors
        );
        return;
      }
      next(error);
    }
  };
}
