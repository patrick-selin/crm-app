// controllers/order-controller.ts
import { Request, Response, NextFunction } from "express";
import * as orderService from "./order-service";
import logger from "../../utils/logger";
import { extractFilters, parsePagination } from "../../utils/request-helpers";

export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  logger.info("Controller invoked: listOrders");

  try {
    const { search, sort, page, limit } = req.query as Record<string, string>;
    const filters = extractFilters(req.query);

    const { page: parsedPage, limit: parsedLimit } = parsePagination(page, limit);

    const orders = await orderService.getOrders({
      search,
      sort,
      page: parsedPage,
      limit: parsedLimit,
      filters,
    });

    logger.info("Orders retrieved successfully", { total: orders.total });
    res.status(200).json(orders);
  } catch (error) {
    logger.error("Error in listOrders", { error });
    next(error);
  }
};

export const getOrdersSummary = async (_req: Request, res: Response) => {
  return res.json({
    totalOrders: 250,
    totalRevenue: 153928.5,
    ordersPerMonth: [
      { month: "January", count: 50, revenue: 30000.0 },
      { month: "December", count: 40, revenue: 25000.0 },
    ],
    mostOrderedProducts: [
      { productId: "123", name: "Laptop", totalSold: 150 },
      { productId: "456", name: "Phone", totalSold: 100 },
    ],
  });
};

export const getOrderDetails = async (_req: Request, res: Response) => {
  return res.json({
    orderId: "26ac6b3e-5c6d-4c3a-98c5-6420fa8f2b1d",
    customer: {
      customerId: "81ce3a22-bed7-4252-bf38-57bd655043ec",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@example.com",
    },
    totalAmount: 120.5,
    paymentStatus: "Pending",
    orderDate: "2025-01-25T10:00:00.000Z",
    createdAt: "2025-01-25T10:00:00.000Z",
    updatedAt: "2025-01-25T10:05:00.000Z",
    items: [
      {
        productId: "e29bca06-425b-46f6-a92b-9c9633edc7ad",
        productName: "Laptop",
        sku: "LAP-001",
        quantity: 1,
        price: 1000.0,
        productImage: "https://example.com/images/laptop.jpg",
      },
      {
        productId: "d12f3e45-6b78-9c12-3d45-678f9abc0123",
        productName: "Keyboard",
        sku: "KEY-002",
        quantity: 2,
        price: 49.99,
        productImage: "https://example.com/images/keyboard.jpg",
      },
    ],
  });
};
