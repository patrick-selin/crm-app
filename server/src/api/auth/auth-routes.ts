// auth-routes.ts
import { Router } from "express";
import * as authController from "./auth-controller";
import { validateBody } from "../../middleware/validate-request";
import {
  RegisterSchema,
} from "../../schemas/user-and-auth-schemas";

const authRoutes = Router();

// Register a new user
authRoutes.post(
  "/register",
  validateBody(RegisterSchema),
  authController.registerUser
);



export default authRoutes;
