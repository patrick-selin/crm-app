// controllers/order-controller.ts
import { Request, Response, NextFunction } from "express";
import * as orderService from "./order-service";
import logger from "../../utils/logger";
import { extractOrderQueryParams } from "../../utils/request-helpers";
import { NotFoundError } from "../../utils/errors/app-errors";

export const listOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: listOrders");

    const queryParams = extractOrderQueryParams(req);
    const orders = await orderService.getOrders(queryParams);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// placeholder json data, feature pending now
// maybe make statics for order route or dashboard
// export const getOrdersSummary = async (_req: Request, res: Response) => {
//   return res.json({
//     totalOrders: 250,
//     totalRevenue: 153928.5,
//     ordersPerMonth: [
//       { month: "January", count: 50, revenue: 30000.0 },
//       { month: "December", count: 40, revenue: 25000.0 },
//     ],
//     mostOrderedProducts: [
//       { productId: "123", name: "Laptop", totalSold: 150 },
//       { productId: "456", name: "Phone", totalSold: 100 },
//     ],
//   });
// };

export const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("Controller invoked: getOrderDetails", { params: req.params });
    
    const { id: orderId } = req.params;
    const orderDetails = await orderService.getOrderDetails(orderId);

    if (!orderDetails) {
      throw new NotFoundError("Order not found", `No record found for order ID = ${orderId}`);
    }

    res.status(200).json(orderDetails);
  } catch (error) {
    logger.error("Controller error in getOrderDetails:", { error });
    next(error);
  }
};