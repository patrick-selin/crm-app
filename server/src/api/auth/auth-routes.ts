// auth-routes.ts
import { Router } from "express";
import * as authController from "./auth-controller";
// import { validateBody } from "../../middleware/validate-request";
// import { RegisterSchema } from "../../schemas/user-and-auth-schemas";

const authRoutes = Router();

// Register a new user
authRoutes.post(
  "/register",
//   validateBody(RegisterSchema),
  authController.registerUserTemp
);

// Simple GET route for /auth
authRoutes.get("/", (req, res) => {
    console.log(`Incoming Request rout: ${req.method} ${req.url}`);
  res.json({
    message: "Auth endpoint is working!",
    timestamp: new Date().toISOString(),
  });
});

export default authRoutes;
