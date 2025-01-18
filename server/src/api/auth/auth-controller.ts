// auth-controller.ts
import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger";
import * as authService from "./auth-service";
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
    logger.error("Controller error in registerUser:", { error });
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokens = await authService.login(req.body);
    res.status(200).json(tokens);
  } catch (error) {
    logger.error("Controller error in loginUser:", { error });
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
      throw new ValidationError("Unauthorized", "User is not authenticated");
    }

    const user = await authService.getAuthDetails(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    logger.error("Controller error in getAuthDetails:", { error });
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    const newTokens = await authService.refreshToken(refreshToken);
    res.status(200).json(newTokens);
  } catch (error) {
    logger.error("Controller error in refreshToken:", { error });
    next(error);
  }
};
