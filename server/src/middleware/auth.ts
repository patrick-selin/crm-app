import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors/app-errors";
import { ZodError } from "zod";
import { JwtPayloadSchema } from "../schemas/auth-schemas";

export const authenticateJWT = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new ValidationError(
          "Missing Authorization Header",
          "Authorization header is required and must start with 'Bearer '"
        )
      );
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as object;
  
      const validatedPayload = JwtPayloadSchema.parse(decoded);
  
      req.user = validatedPayload;
  
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return next(
          new ValidationError("Invalid Token", "JWT verification failed")
        );
      }
  
      if (error instanceof ZodError) {
        return next(
          new ValidationError(
            "Invalid Token Payload",
            "The token payload structure is invalid",
            error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            }))
          )
        );
      }
  
      next(error);
    }
  };
