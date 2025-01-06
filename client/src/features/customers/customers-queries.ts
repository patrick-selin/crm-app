// features/customers/queries.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { getCustomers, addCustomer } from "./customers-api";
import { Customer } from "../../../../shared/schemas/customer-schema";

export const useCustomers = (): UseQueryResult<Customer[], Error> => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
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
