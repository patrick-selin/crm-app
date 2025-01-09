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
  UpdateCustomerSchema,
} from "../../schemas/customer-schemas";

const customerRoutes = Router();

// List all customers
customerRoutes.get("/", customerController.listAllCustomers);

// List customers with metrics
customerRoutes.get("/summary", customerController.listCustomersWithMetrics);

// Get a customer by ID
customerRoutes.get(
  "/:id",
  validateParams(CustomerIdSchema),
  customerController.getCustomerById
);

// Get orders for a customer
//

// Create a new customer
customerRoutes.post(
  "/",
  validateBody(CreateCustomerSchema),
  customerController.createCustomer
);

// Update a customer
customerRoutes.put(
  "/:id",
  validateParams(CustomerIdSchema),
  validateBody(UpdateCustomerSchema),
  customerController.updateCustomer
);

// Delete a customer
customerRoutes.delete(
  "/:id",
  validateParams(CustomerIdSchema),
  customerController.deleteCustomer
);

export default customerRoutes;
