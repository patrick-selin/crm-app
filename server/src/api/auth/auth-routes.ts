// auth-routes.ts
import { Router } from "express";
import * as authController from "./auth-controller";
import { validateBody } from "../../middleware/validate-request";
import {
  RegisterSchema,
  LoginSchema,
} from "../../schemas/user-and-auth-schemas";
import { authenticateJWT } from "../../middleware/auth";

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
authRoutes.get("/me", authenticateJWT, authController.getUserProfile);

// Refresh token


export default authRoutes;
