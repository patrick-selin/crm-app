// features/customers/queries.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getCustomers,
  getCustomersSummary,
  addCustomer,
  getCustomer,
  getCustomerOrders,
} from "./customers-api";
import {
  Customer,
  CustomerSummary,
} from "../../../src/schemas/customer-schemas";
import { Order } from "../../../src/schemas/order-schemas";

export const useCustomers = (): UseQueryResult<Customer[], Error> => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
};

export const useCustomersSummary = (): UseQueryResult<
  CustomerSummary[],
  Error
> => {
  return useQuery({
    queryKey: ["customersSummary"],
    queryFn: getCustomersSummary,
  });
};

export const useCustomer = (id: string): UseQueryResult<Customer, Error> => {
    return useQuery({
      queryKey: ["customer", id],
      queryFn: () => getCustomer(id),
      enabled: !!id,
    });
  };

  export const useCustomerOrders = (
    id: string
  ): UseQueryResult<Order[], Error> => {
    return useQuery({
      queryKey: ["customerOrders", id],
      queryFn: () => getCustomerOrders(id),
      enabled: !!id,
    });
  };  

export const useAddCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
