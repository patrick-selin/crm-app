// customer-routes.ts
import { Router } from "express";
import * as customerController from "./customer-controller";

const customerRoutes = Router();

customerRoutes.get("/", customerController.listAllCustomers);
customerRoutes.get("/summary", customerController.listCustomersWithMetrics);

// GET /api/v1/customers/:id
// GET /api/v1/customers/:id/orders
customerRoutes.post("/", customerController.createCustomer);
// PUT /api/v1/customers/:id
// DELETE /api/v1/customers/:id


export default customerRoutes;
