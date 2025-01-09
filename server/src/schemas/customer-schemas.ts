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
  // TEST: z.string(), // testing
  country: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export const CustomerSummarySchema = CustomerSchema.extend({
  lastOrderDate: z.union([
    z.string().datetime({ offset: true }),
    z.literal("N/A"),
  ]),
  numOfOrders: z.number().nonnegative(),
  totalSpent: z.number().nonnegative(),
});

export const AddCustomerSchema = CustomerSchema.omit({
  customerId: true,
  createdAt: true,
  updatedAt: true,
});

export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerSummary = z.infer<typeof CustomerSummarySchema>;
export type AddCustomer = z.infer<typeof AddCustomerSchema>;
