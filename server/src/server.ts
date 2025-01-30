// server.ts

import express, { Application } from "express";
import cors from "cors";
import morganMiddleware from "./middleware/morgan";
import { unknownEndpoint } from "./middleware/unknown-endpoint";
import { errorHandler } from "./middleware/error-handler";
import healthCheckRoutes from "./api/health/health-routes";
import authRoutes from "./api/auth/auth-routes";
import customerRoutes from "./api/customers/customer-routes";
import orderRoutes from "./api/orders/order-routes"

const app: Application = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);
//routes
app.use((req, _res, next) => {
  console.log(`Incoming Request, ser: ${req.method} ${req.url}`);
  next();
});
app.use("/api/v1/health", healthCheckRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/orders", orderRoutes);
// middleware
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
