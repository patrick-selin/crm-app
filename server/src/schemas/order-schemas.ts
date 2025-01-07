// shared/schemas/order-schemas.ts
import { z } from "zod";

export const OrderSchema = z.object({
  orderId: z.string().uuid(),
  customerId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),
  paymentStatus: z.enum(["Paid", "Pending", "Overdue"]),
  orderDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Paginated orders schema
export const PaginatedOrdersSchema = z.object({
  orders: z.array(OrderSchema),
  total: z.number().nonnegative(),
  page: z.number().min(1),
  limit: z.number().positive(),
});

// Exports
export type Order = z.infer<typeof OrderSchema>;
export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>;
