// src/middleware/error-handler.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import logger from "../utils/logger";
import { AppError, HttpStatusCodes } from "../utils/errors/app-errors";

// Express error-handling middleware
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): Response | void {
  //  Zod validation errors
  if (err instanceof ZodError) {
    logger.warn("Validation error occurred", {
      method: req.method,
      url: req.url,
      details: err.issues,
    });

    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "Validation Error",
      details: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
      statusCode: HttpStatusCodes.BAD_REQUEST,
    });
  }

  // 2. Custom AppError
  if (err instanceof AppError) {
    logger.error(`Application Error: ${err.name}`, {
      method: req.method,
      url: req.url,
      devMessage: err.devMessage,
      statusCode: err.statusCode,
    });

    return res.status(err.statusCode).json({
      error: err.name, // E.g. "BAD_REQUEST", "VALIDATION_ERROR"
      message: err.userMessage,
      statusCode: err.statusCode,
    });
  }

  // Unknown or Unexpected errors
  logger.error("Unexpected Error:", {
    method: req.method,
    url: req.url,
    error: err,
    stack: err instanceof Error ? err.stack : undefined,
  });

  return res.status(HttpStatusCodes.INTERNAL_ERROR).json({
    error: "Internal Server Error",
    statusCode: HttpStatusCodes.INTERNAL_ERROR,
  });
}
