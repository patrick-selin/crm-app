// features/orders/orders-api.ts
import axiosInstance from "../../../services/api-client";
import { OrderDetailResponse } from "../../../schemas/order-schemas";

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
  // console.log("URL params:", params.toString());

  const response = await axiosInstance.get(`/orders?${params}`);
  console.log("API Response for Orders:", response.data);
  return response.data;
};

export const getOrdersSummary = async () => {
  const response = await axiosInstance.get(`/orders/summary`);
  return response.data;
};

export const getOrderById = async (
  orderId: string
): Promise<OrderDetailResponse> => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  console.log(`API Response for Order ${orderId}:`, response.data);
  return response.data;
};

// maybe not needed anymore
export const getOrderDetail = async (
  customerId: string,
  orderId: string
): Promise<OrderDetailResponse> => {
  const response = await axiosInstance.get(
    `/customers/${customerId}/orders/${orderId}`
  );
  return response.data;
};
