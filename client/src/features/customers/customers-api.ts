// features/customers/customers-api.ts
import axios from "axios";
import { Customer } from "../../../../shared/schemas/customer-schema";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/customers/summary`;

export const getCustomersSummary = async (): Promise<Customer[]> => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export const addCustomer = async (
    customer: Omit<Customer, "customerId" | "createdAt" | "updatedAt">
  ): Promise<Customer> => {
    const response = await axios.post(baseUrl, customer);
    return response.data;
  };
