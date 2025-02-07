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
  return useInfiniteQuery({
    queryKey: ["orders", { search, sort, limit, dateRange }],
    queryFn: ({ pageParam = 1 }) => getOrders({ search, sort, limit, pageParam, dateRange }), // ✅ Fetch orders by page
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

