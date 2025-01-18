// auth-controller.ts
import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger";
import * as authService from "./auth-service";
import { ZodError } from "zod";
import { ValidationError } from "../../utils/errors/app-errors";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: registerUser");
    logger.info("Request Body:", req.body);

    const newUser = await authService.registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.userId,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(
        new ValidationError(
          "Invalid registration data",
          "registerUser Zod validation failed",
          error.issues
        )
      );
    }
    logger.error("Controller error in registerUser:", { error });
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Validation error in loginUser:", {
          details: error.issues,
        });
        return next(
          new ValidationError(
            "Invalid login data",
            "Failed Zod schema validation for user login",
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

export const getAuthDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const user = await authService.getAuthDetails(userId);
    res.status(200).json(user);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { refreshToken } = req.body;
  
      if (!refreshToken) {
        throw new ValidationError(
          "Invalid request",
          "Refresh token is required in the body"
        );
      }
  
      const newTokens = await authService.refreshToken(refreshToken);
      res.status(200).json(newTokens);
    } catch (error) {
      next(error);
    }
  };