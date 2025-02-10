// utils/requests-helpers.ts
import { Request } from "express";

// Extracts filters from query params
export const extractFilters = (
  query: Record<string, any>
): Record<string, string> => {
  const { search, sort, page, limit, ...filters } = query;
  return Object.keys(filters).reduce((acc, key) => {
    acc[key] = filters[key];
    return acc;
  }, {} as Record<string, string>);
};

// Extracts and normalizes order query parameters from a request.
export const extractOrderQueryParams = (req: Request) => {
  const { search, sort, page, limit, startDate, endDate } = req.query;

  const filters = extractFilters(req.query);
  delete filters.startDate;
  delete filters.endDate;

  const { page: parsedPage, limit: parsedLimit } = parsePagination(
    page?.toString(),
    limit?.toString()
  );

  return {
    search: search ? search.toString() : "",
    sort: sort ? sort.toString() : "",
    page: parsedPage,
    limit: parsedLimit,
    filters,
    startDate: startDate ? startDate.toString() : undefined,
    endDate: endDate ? endDate.toString() : undefined,
  };
};

// Parses query params for pagination.
export const parsePagination = (
  page?: string,
  limit?: string
): { page: number; limit: number } => ({
  page: parseInt(page || "1", 10),
  limit: parseInt(limit || "10", 10),
});
