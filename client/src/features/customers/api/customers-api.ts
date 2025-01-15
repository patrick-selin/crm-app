// features/customers/customers-api.ts
import axios from "axios";
import { Customer, CustomerSummary } from "../../../schemas/customer-schemas";
import { Order, OrderDetailResponse } from "../../../schemas/order-schemas";

const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await axios.get(`${baseUrl}customers`);
  return response.data.data;
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
}): Promise<{ total: number; totalPages: number; data: CustomerSummary[] }> => {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(sort && { sort }),
    ...(limit && { limit: limit.toString() }),
    ...(page && { page: page.toString() }),
  });

  const response = await axios.get(`${baseUrl}/customers/summary?${params}`);
  const total = Number(response.data.total);
  return {
    total,
    totalPages: Math.ceil(total / limit),
    data: response.data.data,
  };
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await axios.get(`${baseUrl}/customers/${id}`);
  return response.data;
};

export const getCustomerOrders = async (id: string): Promise<Order[]> => {
  const response = await axios.get(`${baseUrl}/customers/${id}/orders`);
  return response.data;
};

export const getOrderDetail = async (
  customerId: string,
  orderId: string
): Promise<OrderDetailResponse> => {
  const response = await axios.get(
    `${baseUrl}/customers/${customerId}/orders/${orderId}`
  );
  return response.data;
};

export const addCustomer = async (
  customer: Omit<Customer, "customerId" | "createdAt" | "updatedAt">
): Promise<Customer> => {
  const response = await axios.post(baseUrl, customer);
  return response.data;
};

export const updateCustomerById = async ({
  id,
  ...data
}: {
  id: string;
  [key: string]: unknown;
}) => {
  const response = await axios.put(`${baseUrl}/${id}`, data);
  return response.data;
};

export const deleteCustomerById = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};
