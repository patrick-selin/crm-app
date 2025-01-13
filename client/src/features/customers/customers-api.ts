// features/customers/customers-api.ts
import axios from "axios";
import {
  Customer,
  CustomerSummary,
} from "../../../src/schemas/customer-schemas";

const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await axios.get(`${baseUrl}customers`);
  return response.data.data;
};

export const getCustomersSummary = async (): Promise<CustomerSummary[]> => {
  const response = await axios.get(`${baseUrl}/customers/summary`);
  //   console.log(response.data.data);
  return response.data.data;
};

export const addCustomer = async (
  customer: Omit<Customer, "customerId" | "createdAt" | "updatedAt">
): Promise<Customer> => {
  const response = await axios.post(baseUrl, customer);
  return response.data;
};
