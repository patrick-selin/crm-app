// orders.ts
import { Router } from "express";
import { authenticateJWT } from "../../middleware/auth-jwt";
import * as orderController from "./order-controller";
import {
  validateQuery,
  validateParams,
  validateBody
} from "../../middleware/validate-request";
import { OrderQuerySchema, OrderIdSchema, OrderStatusUpdateSchema } from "../../schemas/order-schemas";

const orderRoutes = Router();

// List all orders
orderRoutes.get(
  "/",
  authenticateJWT,
  validateQuery(OrderQuerySchema),
  orderController.listOrders
);

// Orders highlight summary
// orderRoutes.get(
//   "/summary",
//   authenticateJWT,
//   validateQuery(OrderQuerySchema),
//   orderController.getOrdersSummary
// );

orderRoutes.get(
  "/:id",
  authenticateJWT,
  validateParams(OrderIdSchema),
  orderController.getOrderDetails
);

orderRoutes.put(
  "/status",
  authenticateJWT,
  validateBody(OrderStatusUpdateSchema),
  orderController.updateOrderStatus
);


export default orderRoutes;
