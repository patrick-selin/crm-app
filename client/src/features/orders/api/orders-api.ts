// features/orders/orders-api.ts
import axiosInstance from "../../../services/api-client";

export const getOrders = async ({
  search = "",
  sort = "",
  limit = 10,
  page = 1,
  dateRange = [null, null],
}: {
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
  dateRange?: [Date | null, Date | null];
}) => {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(sort && { sort }),
    limit: limit.toString(),
    page: page.toString(),
    ...(dateRange[0] && { startDate: dateRange[0].toISOString() }),
    ...(dateRange[1] && { endDate: dateRange[1].toISOString() }),
  });

  // console.log(`PARAMS from API :: ${params}`);

  const response = await axiosInstance.get(`/orders?${params}`);
  return response.data;
};

export const getOrdersSummary = async () => {
  const response = await axiosInstance.get(`/orders/summary`);
  return response.data;
};
