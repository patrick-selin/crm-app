// features/customers/customers-api.ts
import axios from "axios";
import {
  Customer,
  CustomersSummaryResponse,
  CreateCustomer,
  CreateCustomerSchema, UpdateCustomerSchema
} from "../../../schemas/customer-schemas";
import { Order, OrderDetailResponse } from "../../../schemas/order-schemas";

const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

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
}): Promise<{ total: number; page: number; limit: number; data: Customer[] }> => {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(sort && { sort }),
    ...(limit && { limit: limit.toString() }),
    ...(page && { page: page.toString() }),
  });

  const response = await axios.get(`${baseUrl}/customers?${params}`);
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
  const response = await axios.get(`${baseUrl}/customers/summary?${params}`);

  return response.data;
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
  customer: CreateCustomer
): Promise<Customer> => {
  const validatedCustomer = CreateCustomerSchema.parse(customer);

  const response = await axios.post(`${baseUrl}/customers`, validatedCustomer);
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

  const response = await axios.put(`${baseUrl}/customers/${id}`, validatedData);
  return response.data;
};

export const deleteCustomerById = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/customers/${id}`);
  return response.data;
};
