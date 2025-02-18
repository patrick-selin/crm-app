import { Badge, Menu, ActionIcon } from "@mantine/core";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { OrderStatusEnum, OrderStatus } from "../../../schemas/order-schemas";
import { useUpdateOrderStatus } from "../api/orders-queries";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";

const statusColors: Record<OrderStatus, string> = {
  Pending: "blue",
  Processing: "orange",
  Completed: "green",
  Canceled: "red",
};

interface OrderStatusBadgeProps {
  orderId: string;
  initialStatus: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  orderId,
  initialStatus,
}) => {
  const queryClient = useQueryClient();
  const updateOrderStatus = useUpdateOrderStatus();

  const currentStatus =
    queryClient.getQueryData<{ data: { orderId: string; orderStatus: OrderStatus }[] }>(["orders"])
      ?.data.find((order) => order.orderId === orderId)?.orderStatus || initialStatus;

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;

    updateOrderStatus.mutate(
      { orderIds: [orderId], newStatus },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: `Order status updated to "${newStatus}"`,
            color: "green",
          });

          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error: any) => {
          let errorMessage = "Failed to update order status.";

          if (error.response) {
            const { status, data } = error.response;

            if (status === 400) {
              errorMessage =
                data.message ||
                "Invalid status change. Please check the allowed transitions.";
            } else if (status === 404) {
              errorMessage = "The order was not found.";
            } else if (status === 403) {
              errorMessage = "You do not have permission to update this order.";
            }
          }

          notifications.show({
            title: "Error",
            message: errorMessage,
            color: "red",
          });
        },
      }
    );
  };

  return (
    <Menu withinPortal disabled={currentStatus === "Canceled"}>
      <Menu.Target>
        <Badge
          color={statusColors[currentStatus]}
          autoContrast
          rightSection={
            currentStatus !== "Canceled" && (
              <ActionIcon size="xs" variant="transparent">
                <ChevronDownIcon
                  width={14}
                  height={14}
                  stroke="black"
                  strokeWidth={2}
                />
              </ActionIcon>
            )
          }
          styles={{
            root: {
              minWidth: 120,
              textAlign: "right",
              alignItems: "center",
              cursor: currentStatus === "Canceled" ? "not-allowed" : "pointer",
              opacity: currentStatus === "Canceled" ? 0.6 : 1,
            },
          }}
        >
          {currentStatus}
        </Badge>
      </Menu.Target>

      {currentStatus !== "Canceled" && (
        <Menu.Dropdown>
          {OrderStatusEnum.options.map((status) => (
            <Menu.Item
              key={status}
              onClick={() => handleStatusChange(status as OrderStatus)}
            >
              {status}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      )}
    </Menu>
  );
};

export default OrderStatusBadge;
