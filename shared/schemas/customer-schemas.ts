// shared/schemas/customer-schemas.ts
import { z } from "zod";

export const CustomerSchema = z.object({
  customerId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CustomerSummarySchema = CustomerSchema.extend({
  lastOrderDate: z.union([
    z.string().datetime({ offset: true }),
    z.literal("N/A"),
  ]),
  numOfOrders: z.number().nonnegative(),
  totalSpent: z.number().nonnegative(),
});

export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerSummary = z.infer<typeof CustomerSummarySchema>;
