// utils/query-helpers.ts
import { sql, and } from "drizzle-orm";

// Calculates the offset for pagination
export const calculateOffset = (page: number, limit: number): number => {
  if (page < 1) {
    throw new Error("Page number must be greater than or equal to 1.");
  }
  return (page - 1) * limit;
};
