// shared/schemas/order-schemas.ts
// shared/schemas/order-schemas.ts
import { z } from "zod";

export const OrderStatusEnum = z.enum(["Pending", "Processing", "Completed", "Canceled"]);

// Order Schema
export const OrderSchema = z.object({
  orderId: z.string().uuid(),
  customerId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),  
  orderStatus: OrderStatusEnum,
  orderDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateOrderStatusSchema = z.object({
  orderStatus: OrderStatusEnum,
});


// export const PaginatedOrdersSchema = z.object({
//   orders: z.array(OrderSchema),
//   total: z.number().nonnegative(),
//   page: z.number().min(1),
//   limit: z.number().positive(),
// });

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

export const OrderDetailResponseSchema = z.object({
  order: OrderSchema,
  items: z.array(OrderItemSchema),
});

export const OrderQuerySchema = z.object({
  search: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type Order = z.infer<typeof OrderSchema>;
// export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderDetailResponse = z.infer<typeof OrderDetailResponseSchema>;
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;
export type OrderQuery = z.infer<typeof OrderQuerySchema>;
