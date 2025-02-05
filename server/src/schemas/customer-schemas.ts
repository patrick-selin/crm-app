// shared/schemas/customer-schemas.ts
import { z } from "zod";

export const CustomerSchema = z.object({
  customerId: z.string().uuid(),
  firstName: z
    .string()
    .min(2, { message: "First name is required" })
    .max(50, { message: "First name must not exceed 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name is required" })
    .max(50, { message: "Last name must not exceed 50 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must not exceed 100 characters" }),
  phone: z
    .string()
    .min(8, { message: "Phone number is required, min 8" })
    .max(15, { message: "Phone number must not exceed 15 characters" }),
  address: z
    .string()
    .min(2, { message: "Address is required,, min 2" })
    .max(100, { message: "Address must not exceed 100 characters" }),
  city: z
    .string()
    .min(1, { message: "City is required" })
    .max(50, { message: "City must not exceed 50 characters" }),
  postalCode: z
    .string()
    .min(5, { message: "Postal code is required, min 5" })
    .max(6, { message: "Postal code must not exceed 6 characters" }),
  country: z
    .string()
    .min(1, { message: "Country is required" })
    .max(50, { message: "Country must not exceed 50 characters" }),
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

export const UpdateCustomerSchema = CustomerSchema.omit({
  customerId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const CustomerIdSchema = z.object({
  id: z.string().uuid(),
});

export const CustomerOrderSchema = z.object({
  orderId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),
  orderStatus: z.enum(["Pending", "Processing", "Completed", "Canceled"]),
  orderDate: z.date(),
});

export const CustomersQuerySchema = z
  .object({
    search: z.string().optional(),
    sort: z
      .string()
      .regex(
        /^(city|country|firstName|lastName|address|postalCode|createdAt|email):(asc|desc)$/i,
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
        /^(firstName|lastName|email|totalSpent|numOfOrders|lastOrderDate|createdAt):(asc|desc)$/i,
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
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
export type CustomersQuery = z.infer<typeof CustomersQuerySchema>;
export type CustomersSummaryResponse = z.infer<
  typeof CustomersSummaryResponseSchema
>;
