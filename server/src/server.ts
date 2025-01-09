// server.ts

import express, { Application } from "express";
import cors from "cors";
import morganMiddleware from "./middleware/morgan";
import { unknownEndpoint } from "./middleware/unknown-endpoint";
import { errorHandler } from "./middleware/error-handler";
import healthCheckRoutes from "./api/health/healthRoutes";
import testRoutes from "./api/test-route/test-routes";
import customerRoutes from "./api/customers/customer-routes";

const app: Application = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);
//routes
app.use("/api/v1/health", healthCheckRoutes);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/customers", customerRoutes);
// middleware
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
