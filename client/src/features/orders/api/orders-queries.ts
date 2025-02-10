import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getOrders, getOrdersSummary } from "./orders-api";

export const useOrdersInfinite = ({
  search,
  sort,
  limit = 10,
  dateRange,
}: {
  search?: string;
  sort?: string;
  limit?: number;
  dateRange?: [Date | null, Date | null];
}) => {
  // Convert the date range into ISO strings (or null)
  const startDate = dateRange && dateRange[0] ? dateRange[0].toISOString() : null;
  const endDate = dateRange && dateRange[1] ? dateRange[1].toISOString() : null;

  return useInfiniteQuery({
    queryKey: ["orders", { search, sort, limit, startDate, endDate }],
    queryFn: ({ pageParam = 1 }) =>
      getOrders({ search, sort, limit, pageParam, startDate, endDate }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.length < limit ? undefined : nextPage;
    },
    initialPageParam: 1,
  });
};

export const useOrdersSummary = () => {
  return useQuery({
    queryKey: ["ordersSummary"],
    queryFn: getOrdersSummary,
  });
};

