// utils/query-helpers.ts
import { sql, and } from "drizzle-orm";

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
        conditions.push(sql`${sql.identifier(key)} = ${value}`);
      }
    }
    
    return conditions.length > 0 ? and(...conditions) : undefined;
  };
  