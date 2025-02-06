import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOrders, getOrdersSummary } from "./orders-api";

export const useOrders = ({
  search,
  sort,
  limit,
  page,
  dateRange,
}: {
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
  dateRange?: [Date | null, Date | null];
}) => {
  return useQuery({
    queryKey: ["orders", { search, sort, limit, page, dateRange }],
    queryFn: () => getOrders({ search, sort, limit, page, dateRange }),
    placeholderData: keepPreviousData,
  });
};

export const useOrdersSummary = () => {
  return useQuery({
    queryKey: ["ordersSummary"],
    queryFn: getOrdersSummary,
  });
};

