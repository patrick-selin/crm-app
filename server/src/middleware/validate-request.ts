// middleware/validate-request.ts

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../utils/errors/app-errors";

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ValidationError(
            "Invalid request body",
            "Request body schema validation failed",
            error.issues
          )
        );
      }
      next(error);
    }
  };
}

export const validateParams = (schema: ZodSchema<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ValidationError(
            "Invalid request parameters",
            "Request parameter validation failed",
            error.issues
          )
        );
      }
      next(error);
    }
  };
};
