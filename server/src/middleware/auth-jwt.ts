import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ValidationError, UnauthorizedError } from "../utils/errors/app-errors";
import { ZodError } from "zod";
import { JwtPayloadSchema } from "../schemas/user-and-auth-schemas";
import { config } from "../config/config";

export const authenticateJWT = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  // Handle missing or malformed Authorization header
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError(
        "Missing Authorization Header",
        "Authorization header is required and must start with 'Bearer '"
      )
    );
  }

  const token = authorization.split(" ")[1];

  // Ensure JWT secret is configured
  if (!config.JWT_SECRET) {
    return next(
      new ValidationError(
        "Server Configuration Error",
        "JWT_SECRET environment variable is not defined"
      )
    );
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;

    // Validate payload structure using Zod schema
    const validatedPayload = JwtPayloadSchema.parse(decoded);

    // Attach validated user info to the request object
    req.user = validatedPayload;

    return next();
  } catch (error) {
    // Handle token expiration
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new UnauthorizedError(
          "Access Token Expired",
          "The access token has expired. Please refresh your token."
        )
      );
    }

    // Handle invalid or malformed tokens
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new UnauthorizedError(
          "Invalid Token",
          "Invalid or malformed JWT"
        )
      );
    }

    // Handle Zod validation errors
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

    // Log and forward unexpected errors
    console.error("Unexpected error in JWT authentication:", error);
    return next(error);
  }
};
