// shared/schemas/customer-order-schema.ts
import { z } from "zod";

export const CustomerOrderSchema = z.object({
  orderId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),
  paymentStatus: z.enum(["Paid", "Pending", "Overdue"]),
  orderDate: z.date(),
});
