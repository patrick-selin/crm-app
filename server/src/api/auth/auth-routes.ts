// auth-routes.ts
import { Router } from "express";
import * as authController from "./auth-controller";
import { validateBody } from "../../middleware/validate-request";
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
} from "../../schemas/user-and-auth-schemas";
import { authenticateJWT } from "../../middleware/auth-jwt";

const authRoutes = Router();

// Register a new user
authRoutes.post(
  "/register",
  validateBody(RegisterSchema),
  authController.registerUser
);
// Login a user
authRoutes.post("/login", validateBody(LoginSchema), authController.loginUser);

// Get logged-in user's details
authRoutes.get("/me", authenticateJWT, authController.getAuthDetails);

// Refresh token
authRoutes.post(
  "/refresh",
  validateBody(RefreshTokenSchema),
  authController.refreshToken
);

export default authRoutes;
