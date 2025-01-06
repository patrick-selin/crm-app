// features/customers/queries.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { getCustomersSummary, addCustomer } from "./customers-api";
import { Customer } from "../../../../shared/schemas/customer-schema";

export const useCustomers = (): UseQueryResult<Customer[], Error> => {
  return useQuery({
    queryKey: ["customers"],
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
