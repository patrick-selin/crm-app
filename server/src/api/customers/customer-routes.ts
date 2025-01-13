// customer-routes.ts
import { Router } from "express";
import * as customerController from "./customer-controller";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate-request";
import {
  CreateCustomerSchema,
  CustomerIdSchema,
  UpdateCustomerSchema,
  CustomersQuerySchema,
} from "../../schemas/customer-schemas";
import { OrderIdSchema } from "../../schemas/order-schemas";

const customerRoutes = Router();

// List all customers
customerRoutes.get(
  "/",
    validateQuery(CustomersQuerySchema),
    
  customerController.listAllCustomersWithParams
);

// List customers with metrics
customerRoutes.get("/summary", customerController.listCustomersWithMetrics);

// Get a customer by ID
customerRoutes.get(
  "/:id",
  validateParams(CustomerIdSchema),
  customerController.getCustomerById
);

// Get all orders for a customer
customerRoutes.get(
  "/:id/orders",
  validateParams(CustomerIdSchema),
  customerController.getCustomerOrders
);

// Get specific order scoped under customers
customerRoutes.get(
  "/:id/orders/:orderId",
  validateParams(CustomerIdSchema.and(OrderIdSchema)),
  customerController.getCustomerOrderDetails
);

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
