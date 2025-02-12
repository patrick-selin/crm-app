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
import { CustomersSummaryResponse } from "../../../schemas/customer-schemas";

export const useCustomers = ({
  search,
  sort,
  limit,
  page,
}: {
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["customers", { search, sort, limit, page }],
    queryFn: () => getCustomers({ search, sort, limit, page }),
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
}): UseQueryResult<CustomersSummaryResponse, Error> => {
  return useQuery({
    queryKey: ["customersSummary", { search, sort, limit, page }],
    queryFn: () => getCustomersSummary({ search, sort, limit, page }),
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
