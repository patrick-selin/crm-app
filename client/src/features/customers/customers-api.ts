// features/customers/customers-api.ts
import axios from "axios";
import { Customer, CustomerSummary } from "../../../../shared/schemas/customer-schemas";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/customers/`;

export const getCustomers= async (): Promise<Customer[]> => {
    const response = await axios.get(baseUrl);
    return response.data;
  };

export const getCustomersSummary = async (): Promise<CustomerSummary[]> => {
  const response = await axios.get(`${baseUrl}/summary`);
  return response.data;
};

export const addCustomer = async (
  customer: Omit<Customer, "customerId" | "createdAt" | "updatedAt">
): Promise<Customer> => {
  const response = await axios.post(baseUrl, customer);
  return response.data;
};
