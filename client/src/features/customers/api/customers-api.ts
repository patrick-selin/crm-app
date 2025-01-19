// features/customers/customers-api.ts
import axiosInstance from "../../../services/api-client";
import {
  Customer,
  CustomersSummaryResponse,
  CreateCustomer,
  CreateCustomerSchema,
  UpdateCustomerSchema,
} from "../../../schemas/customer-schemas";
import { Order, OrderDetailResponse } from "../../../schemas/order-schemas";

export const getCustomers = async ({
  search = "",
  sort = "",
  limit = 10,
  page = 1,
}: {
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
}): Promise<{
  total: number;
  page: number;
  limit: number;
  data: Customer[];
}> => {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(sort && { sort }),
    ...(limit && { limit: limit.toString() }),
    ...(page && { page: page.toString() }),
  });

  const response = await axiosInstance.get(`/customers?${params}`);
  return response.data;
};
export const getCustomersSummary = async ({
  search,
  sort,
  limit = 10,
  page = 1,
}: {
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
}): Promise<CustomersSummaryResponse> => {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(sort && { sort }),
    ...(limit && { limit: limit.toString() }),
    ...(page && { page: page.toString() }),
  });
  const response = await axiosInstance.get(`/customers/summary?${params}`);

  return response.data;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await axiosInstance.get(`/customers/${id}`);
  return response.data;
};

export const getCustomerOrders = async (id: string): Promise<Order[]> => {
  const response = await axiosInstance.get(`/customers/${id}/orders`);
  return response.data;
};

export const getOrderDetail = async (
  customerId: string,
  orderId: string
): Promise<OrderDetailResponse> => {
  const response = await axiosInstance.get(
    `/customers/${customerId}/orders/${orderId}`
  );
  return response.data;
};

export const addCustomer = async (
  customer: CreateCustomer
): Promise<Customer> => {
  const validatedCustomer = CreateCustomerSchema.parse(customer);

  const response = await axiosInstance.post(`/customers`, validatedCustomer);
  return response.data;
};

export const updateCustomerById = async ({
  id,
  ...data
}: {
  id: string;
  [key: string]: unknown;
}): Promise<Customer> => {
  const validatedData = UpdateCustomerSchema.parse(data);

  const response = await axiosInstance.put(`/customers/${id}`, validatedData);
  return response.data;
};

export const deleteCustomerById = async (id: string) => {
  const response = await axiosInstance.delete(`/customers/${id}`);
  return response.data;
};
