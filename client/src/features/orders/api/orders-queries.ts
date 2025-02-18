import {
  useQuery,
  useInfiniteQuery,
  UseQueryResult,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {
  getOrders,
  getOrdersSummary,
  getOrderById,
  updateOrderStatus,
} from "./orders-api";
import { OrderDetailResponse } from "../../../schemas/order-schemas";

export const useOrdersInfinite = ({
  search,
  sort,
  limit = 10,
  dateRange,
}: {
  search?: string;
  sort?: string;
  limit?: number;
  dateRange?: [Date | null, Date | null];
}) => {
  // Convert the date range into ISO strings (or null)
  const startDate =
    dateRange && dateRange[0] ? dateRange[0].toISOString() : null;
  const endDate = dateRange && dateRange[1] ? dateRange[1].toISOString() : null;

  return useInfiniteQuery({
    queryKey: ["orders", { search, sort, limit, startDate, endDate }],
    queryFn: ({ pageParam = 1 }) =>
      getOrders({ search, sort, limit, pageParam, startDate, endDate }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.length < limit ? undefined : nextPage;
    },
    initialPageParam: 1,
  });
};

export const useOrdersSummary = () => {
  return useQuery({
    queryKey: ["ordersSummary"],
    queryFn: getOrdersSummary,
  });
};

export const useOrderDetail = (
  orderId?: string
): UseQueryResult<OrderDetailResponse, Error> => {
  return useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: Boolean(orderId),
  });
};

export const useOrderItems = (orderId?: string) => {
  return useQuery<OrderDetailResponse, Error>({
    queryKey: ["orderItems", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,

    onMutate: async ({ orderIds, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      const previousOrders = queryClient.getQueryData(["orders"]);

      // Optimistically update orders in cache
      queryClient.setQueryData(["orders"], (oldOrders: any) => {
        if (!oldOrders) return oldOrders;
        return {
          ...oldOrders,
          data: oldOrders.data.map((order: any) =>
            orderIds.includes(order.orderId)
              ? { ...order, orderStatus: newStatus }
              : order
          ),
        };
      });

      return { previousOrders };
    },


    onError: (_, __, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
