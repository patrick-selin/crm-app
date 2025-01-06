// shared/schemas/common-schemas.ts

import { z } from "zod";

// Generic pagination schema
export const PaginationParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().positive().default(10),
});

export const PaginatedSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    items: z.array(schema),
    total: z.number().nonnegative(),
    page: z.number().min(1),
    limit: z.number().positive(),
  });

// Error schema
export const ErrorSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
});

// Exports
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type ErrorResponse = z.infer<typeof ErrorSchema>;