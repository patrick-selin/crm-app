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
} from "./customers-api";
import {
  Customer,
  CustomerSummary,
} from "../../../src/schemas/customer-schemas";

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

export const useAddCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
