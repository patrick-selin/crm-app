// shared/schemas/order-schemas.ts
import { z } from "zod";

export const OrderSchema = z.object({
  orderId: z.string().uuid(),
  customerId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),
  paymentStatus: z.enum(["Completed", "Pending", "Overdue"]),
  orderDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
});

export const PaginatedOrdersSchema = z.object({
  orders: z.array(OrderSchema),
  total: z.number().nonnegative(),
  page: z.number().min(1),
  limit: z.number().positive(),
});

export const OrderIdSchema = z.object({
  orderId: z.string().uuid(),
});

export const OrderItemSchema = z.object({
  orderItemId: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

export type Order = z.infer<typeof OrderSchema>;
export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>;
