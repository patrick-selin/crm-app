// server.ts

import express, { Application } from "express";
import cors from "cors";
import morganMiddleware from "./middleware/morgan";
import { unknownEndpoint } from "./middleware/unknown-endpoint";
import healthCheckRoutes from "./routes/healthRoutes";
import testRoutes from "./routes/testRoutes";
import customerRoutes from "./features/customers/customer-routes";

const app: Application = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);
//routes
app.use("/api/v1", healthCheckRoutes);
app.use("/api/v1", testRoutes);
app.use("/api/v1/customers", customerRoutes);

// middleware
app.use(unknownEndpoint);
// error handeler middleware

export default app;
