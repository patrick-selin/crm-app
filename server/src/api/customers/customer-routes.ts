// customer-routes.ts
import { Router } from "express";
import * as customerController from "./customer-controller";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate-request";
import { authenticateJWT } from "../../middleware/auth-jwt";
import {
  CreateCustomerSchema,
  CustomerIdSchema,
  UpdateCustomerSchema,
  CustomersQuerySchema,
  CustomersSummaryQuerySchema,
} from "../../schemas/customer-schemas";
import { CustomerOrderIdSchema } from "../../schemas/order-schemas";

const customerRoutes = Router();

// List all customers
customerRoutes.get(
  "/",
  authenticateJWT,
  validateQuery(CustomersQuerySchema),
  customerController.listCustomers
);

// List all customers, with order summary
customerRoutes.get(
  "/summary",
  authenticateJWT,
  validateQuery(CustomersSummaryQuerySchema),
  customerController.listCustomersWithMetrics
);

// Get a customer by ID
customerRoutes.get(
  "/:id",
  authenticateJWT,
  validateParams(CustomerIdSchema),
  customerController.getCustomerById
);

// Get all orders for a customer
customerRoutes.get(
  "/:id/orders",
  authenticateJWT,
  validateParams(CustomerIdSchema),
  customerController.getCustomerOrders
);

// Get specific order scoped under customers
customerRoutes.get(
  "/:id/orders/:orderId",
  authenticateJWT,
  validateParams(CustomerIdSchema.and(CustomerOrderIdSchema)),
  customerController.getCustomerOrderDetails
);

// Create a new customer
customerRoutes.post(
  "/",
  authenticateJWT,
  validateBody(CreateCustomerSchema),
  customerController.createCustomer
);

// Update a customer
customerRoutes.put(
  "/:id",
  authenticateJWT,
  validateParams(CustomerIdSchema),
  validateBody(UpdateCustomerSchema),
  customerController.updateCustomer
);

// Delete a customer
customerRoutes.delete(
  "/:id",
  authenticateJWT,
  validateParams(CustomerIdSchema),
  customerController.deleteCustomer
);

export default customerRoutes;
