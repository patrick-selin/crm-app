// controllers/order-controller.ts
import { Request, Response } from "express";

export const listOrders = async (_req: Request, res: Response) => {
    return res.json({
      total: 50,
      page: 1,
      limit: 10,
      data: [
        {
          orderId: "26ac6b3e-5c6d-4c3a-98c5-6420fa8f2b1d",
          customer: {
            customerId: "81ce3a22-bed7-4252-bf38-57bd655043ec",
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice.johnson@example.com"
          },
          totalAmount: 120.50,
          paymentStatus: "Pending",
          orderDate: "2025-01-25T10:00:00.000Z",
          createdAt: "2025-01-25T10:00:00.000Z",
          updatedAt: "2025-01-25T10:05:00.000Z",
          numItems: 3
        }
      ]
    });
  };

  export const getOrdersSummary = async (_req: Request, res: Response) => {
    return res.json({
      totalOrders: 250,
      totalRevenue: 153928.50,
      ordersPerMonth: [
        { "month": "January", "count": 50, "revenue": 30000.00 },
        { "month": "December", "count": 40, "revenue": 25000.00 }
      ],
      mostOrderedProducts: [
        { "productId": "123", "name": "Laptop", "totalSold": 150 },
        { "productId": "456", "name": "Phone", "totalSold": 100 }
      ]
    });
  };
  