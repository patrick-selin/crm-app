// src/middleware/error-handler.ts
// importtaa errorit

// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';
import { BaseError } from '../errors/BaseError';

/**
 * Express error-handling middleware. Must include four parameters (err, req, res, next).
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  // 1. Handle Zod validation errors
  if (err instanceof ZodError) {
    logger.warn('Validation error occurred', {
      method: req.method,
      url: req.url,
      details: err.issues,
    });

    // Return 422 (Unprocessable Entity) or 400 (Bad Request),
    // whichever you prefer for validation issues:
    return res.status(422).json({
      error: 'Validation Error',
      details: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
      statusCode: 422,
    });
  }

  // 2. Handle our custom application errors (BaseError)
  if (err instanceof BaseError) {
    logger.error('Application Error:', {
      method: req.method,
      url: req.url,
      message: err.message,
      statusCode: err.statusCode,
    });

    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  // 3. Handle unknown or unexpected errors
  logger.error('Unexpected Error:', {
    method: req.method,
    url: req.url,
    error: err,
    // If err is an Error, log stack:
    stack: err instanceof Error ? err.stack : undefined,
  });

  return res.status(500).json({
    error: 'Internal Server Error',
    statusCode: 500,
  });
}
