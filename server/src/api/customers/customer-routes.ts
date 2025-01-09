// customer-routes.ts
import { Router } from "express";
import * as customerController from "./customer-controller";
import {
  validateBody,
  validateParams,
} from "../../middleware/validate-request";
import {
  CreateCustomerSchema,
  CustomerIdSchema,
} from "../../schemas/customer-schemas";

const customerRoutes = Router();

customerRoutes.get("/", customerController.listAllCustomers);
customerRoutes.get("/summary", customerController.listCustomersWithMetrics);

customerRoutes.get(
  "/:id",
  validateParams(CustomerIdSchema),
  customerController.getCustomerById
);
// GET /api/v1/customers/:id/orders
customerRoutes.post(
  "/",
  validateBody(CreateCustomerSchema),
  customerController.createCustomer
);
// PUT /api/v1/customers/:id
// DELETE /api/v1/customers/:id

export default customerRoutes;
