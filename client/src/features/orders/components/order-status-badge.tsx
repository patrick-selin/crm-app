import { useState } from "react";
import { Badge, Menu, ActionIcon } from "@mantine/core";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { OrderStatusEnum, OrderStatus } from "../../../schemas/order-schemas";
import { useUpdateOrderStatus } from "../api/orders-queries";
import { notifications } from "@mantine/notifications";

const statusColors: Record<typeof OrderStatusEnum._type, string> = {
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
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const updateOrderStatus = useUpdateOrderStatus();


  
  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === status) return;

    setStatus(newStatus);

    updateOrderStatus.mutate(
      { orderIds: [orderId], newStatus },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: `Order ${orderId} updated to ${newStatus}`,
            color: "green",
          });
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message: `Failed to update order status: ${error.message}`,
            color: "red",
          });
          setStatus(initialStatus);
        },
      }
    );
  };

  return (
    <Menu withinPortal disabled={status === "Canceled"}>
      <Menu.Target>
        <Badge
          color={statusColors[status]}
          autoContrast
          rightSection={
            status !== "Canceled" && (
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
              cursor: status === "Canceled" ? "not-allowed" : "pointer",
              opacity: status === "Canceled" ? 0.6 : 1,
            },
          }}
        >
          {status}
        </Badge>
      </Menu.Target>

      {status !== "Canceled" && (
        <Menu.Dropdown>
          {OrderStatusEnum.options.map((s) => (
            <Menu.Item
              key={s}
              onClick={() => handleStatusChange(s as OrderStatus)}
            >
              {s}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      )}
    </Menu>
  );
};

export default OrderStatusBadge;
