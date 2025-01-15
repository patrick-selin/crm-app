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
  getCustomerById,
  getCustomerOrders,
  updateCustomerById,
  deleteCustomerById,
} from "./customers-api";
import { Customer, CustomerSummary } from "../../../schemas/customer-schemas";
import { OrderDetailResponse } from "../../../schemas/order-schemas";

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
}): UseQueryResult<CustomerSummary[], Error> => {
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

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: Boolean(id),
  });
};

export const useCustomerOrders = (id: string) => {
  return useQuery({
    queryKey: ["customerOrders", id],
    queryFn: () => getCustomerOrders(id),
    enabled: Boolean(id),
  });
};

export const useOrderDetail = (
  customerId: string,
  orderId: string
): UseQueryResult<OrderDetailResponse, Error> => {
  return useQuery({
    queryKey: ["orderDetail", customerId, orderId],
    queryFn: () => getOrderDetail(customerId, orderId),
    enabled: Boolean(customerId && orderId),
  });
};

export const useAddCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customersSummary"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomerById,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
      queryClient.invalidateQueries({ queryKey: ["customersSummary"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerById,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["customers", id] });
      queryClient.invalidateQueries({ queryKey: ["customersSummary"] });
    },
  });
};
