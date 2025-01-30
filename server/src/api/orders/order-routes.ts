// orders.ts
import { Router } from "express";
import { authenticateJWT } from "../../middleware/auth-jwt";
import * as orderController from "./order-controller";

const orderRoutes = Router();

// List all orders
orderRoutes.get(
  "/",
  authenticateJWT,
  // validateQuery(OrderQuerySchema),
  orderController.listOrders
);

// List all orders, with highlight summary
orderRoutes.get(
  "/summary",
  authenticateJWT,
//   validateQuery(OrderQuerySchema),
  orderController.getOrdersSummary
);

// orderRoutes.get(
//   "/:id",
//   authenticateJWT,
//   // validateParams(OrderIdSchema),
//   orderController.getOrderDetails
// );

export default orderRoutes;