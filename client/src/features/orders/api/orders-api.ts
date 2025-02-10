// features/orders/orders-api.ts
import axiosInstance from "../../../services/api-client";

export const getOrders = async ({
  search = "",
  sort = "",
  limit = 10,
  pageParam = 1,
  startDate = null,
  endDate = null,
}: {
  search?: string;
  sort?: string;
  limit?: number;
  pageParam?: number;
  startDate?: string | null;
  endDate?: string | null;
}) => {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(sort && { sort }),
    limit: limit.toString(),
    page: pageParam.toString(),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  });

  console.log("URL params:", params.toString());

  const response = await axiosInstance.get(`/orders?${params}`);
  return response.data;
};

export const getOrdersSummary = async () => {
  const response = await axiosInstance.get(`/orders/summary`);
  return response.data;
};
