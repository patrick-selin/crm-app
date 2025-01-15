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

export const CustomerSummarySchema = z.object({
  customerId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  lastOrderDate: z.union([z.coerce.date(), z.literal("No orders")]),
  numOfOrders: z.number().nonnegative(),
  totalSpent: z.number().nonnegative(),
});

export const CustomersSummaryResponseSchema = z.object({
  total: z.coerce.number().nonnegative(),
  page: z.coerce.number().min(1),
  limit: z.coerce.number().positive(),
  data: z.array(CustomerSummarySchema),
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

export const CustomersQuerySchema = z
  .object({
    search: z.string().optional(),
    sort: z
      .string()
      .regex(
        /^(city|country|firstName|lastName|address|postalCode):(asc|desc)$/i,
        "Sort format should be 'column:asc' or 'column:desc'"
      )
      .optional(),
    page: z
      .preprocess(
        (val) => parseInt(val as string, 10),
        z.number().int().min(1).default(1)
      )
      .optional(),
    limit: z
      .preprocess(
        (val) => parseInt(val as string, 10),
        z.number().int().min(1).max(50).default(10)
      )
      .optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  })
  .strict();

export const CustomersSummaryQuerySchema = z
  .object({
    search: z.string().optional(),
    sort: z
      .string()
      .regex(
        /^(firstName|lastName|email|totalSpent|numOfOrders|lastOrderDate):(asc|desc)$/i,
        "Sort format should be 'column:asc' or 'column:desc'"
      )
      .optional(),
    page: z
      .preprocess(
        (val) => parseInt(val as string, 10),
        z.number().int().min(1).default(1)
      )
      .optional(),
    limit: z
      .preprocess(
        (val) => parseInt(val as string, 10),
        z.number().int().min(1).max(50).default(10)
      )
      .optional(),
  })
  .strict();

export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerSummary = z.infer<typeof CustomerSummarySchema>;
export type AddCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
export type CustomersQuery = z.infer<typeof CustomersQuerySchema>;
export type CustomersSummaryResponse = z.infer<typeof CustomersSummaryResponseSchema>;
