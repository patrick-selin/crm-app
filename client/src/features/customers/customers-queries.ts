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

export const useCustomersSummary = ({
    search,
    sort,
    limit,
    page,
  }: {
    search?: string;
    sort?: string;
    limit?: number;
    page?: number;
  }): UseQueryResult<CustomerSummary[], Error>  => {
    return useQuery({
      queryKey: ["customersSummary", { search, sort, limit, page }],
      queryFn: () => getCustomersSummary({ search, sort, limit, page }),
      placeholderData: () => ({
        total: 0,
        totalPages: 1,
        data: [],
      }),
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
