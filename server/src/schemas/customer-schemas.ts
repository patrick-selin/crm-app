// shared/schemas/customer-schemas.ts
import { z } from "zod";

export const CustomerSchema = z.object({
  customerId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),

  country: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export const CustomerSummarySchema = CustomerSchema.extend({
  lastOrderDate: z.union([
    z.coerce.date(),
    z.literal("No orders"),
  ]),
  numOfOrders: z.number().nonnegative(),
  totalSpent: z.number().nonnegative(),
});

export const CreateCustomerSchema = CustomerSchema.omit({
  customerId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCustomerSchema = CustomerSchema.partial();

export const CustomerIdSchema = z.object({
  id: z.string().uuid(),
});

export const CustomerOrderSchema = z.object({
  orderId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),
  paymentStatus: z.enum(["Completed", "Pending", "Overdue"]),
  orderDate: z.date(),
});

export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerSummary = z.infer<typeof CustomerSummarySchema>;
export type AddCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;