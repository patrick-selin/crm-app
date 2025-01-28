// utils/requests-helpers.ts

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


// Parses query params for pagination.
export const parsePagination = (
  page?: string,
  limit?: string
): { page: number; limit: number } => ({
  page: parseInt(page || "1", 10),
  limit: parseInt(limit || "10", 10),
});
