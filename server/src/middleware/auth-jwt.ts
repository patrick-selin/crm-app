import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors/app-errors";
import { ZodError } from "zod";
import { JwtPayloadSchema } from "../schemas/user-and-auth-schemas";
import { config } from "../config/config";

export const authenticateJWT = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(
      new ValidationError(
        "Missing Authorization Header",
        "Authorization header is required and must start with 'Bearer '"
      )
    );
  }

  const token = authorization.split(" ")[1];

  if (!config.JWT_SECRET) {
    return next(
      new ValidationError(
        "Server Configuration Error",
        "JWT_SECRET environment variable is not defined"
      )
    );
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;

    const validatedPayload = JwtPayloadSchema.parse(decoded);

    req.user = validatedPayload;

    return next();
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

    return next(error);
  }
};
