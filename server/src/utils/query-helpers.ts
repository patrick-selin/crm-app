// utils/query-helpers.ts
import { sql, and, asc, desc, SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { orders } from "../db/schemas/orders";

// Calculates the offset for pagination
export const calculateOffset = (page: number, limit: number): number => {
  if (page < 1) {
    throw new Error("Page number must be greater than or equal to 1.");
  }
  return (page - 1) * limit;
};

// Creates search and filter for SQL queries.
export const createSearchAndFilterConditions = (
  search?: string,
  filters?: Record<string, string>,
  searchableColumns?: Array<any>
): any => {
  const conditions = [];

  if (search && searchableColumns && searchableColumns.length > 0) {
    const searchConditions = searchableColumns.map(
      (column) => sql`${column} ILIKE ${`%${search}%`}`
    );
    conditions.push(sql`(${sql.join(searchConditions, sql` OR `)})`);
  }

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      conditions.push(
        key === "order_status"
          ? sql`${orders.orderStatus} = ${value}`
          : sql`${sql.identifier(key)} = ${value}`
      );
    }
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
};

// Parses sorting params to column and direction for SQL queries.
export const parseSorting = (
  sort: string,
  sortMapping: Record<string, PgColumn | SQL<any>>
): ReturnType<typeof asc | typeof desc> => {
  const [columnKey, direction = "DESC"] = sort.split(":");
  const column = sortMapping[columnKey];

  if (!column) {
    throw new Error(`Invalid sort column: ${columnKey}`);
  }

  if (direction.toUpperCase() === "ASC") {
    return asc(column);
  } else if (direction.toUpperCase() === "DESC") {
    return desc(column);
  } else {
    throw new Error(`Invalid sort direction: ${direction}`);
  }
};
