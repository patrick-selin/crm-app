import { useState } from "react";
import { Badge, Menu, ActionIcon } from "@mantine/core";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { OrderStatusEnum } from "../../../schemas/order-schemas";

const statusColors: Record<typeof OrderStatusEnum._type, string> = {
  Pending: "blue",
  Processing: "orange",
  Completed: "green",
  Canceled: "red",
};

interface OrderStatusBadgeProps {
  orderId: string;
  initialStatus: typeof OrderStatusEnum._type;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  initialStatus,
}) => {
  const [status, setStatus] =
    useState<typeof OrderStatusEnum._type>(initialStatus);

  const handleStatusChange = (newStatus: typeof OrderStatusEnum._type) => {
    setStatus(newStatus);
    // TODO: Send API request to update status
  };

  const orderStatuses =
    OrderStatusEnum.options as (typeof OrderStatusEnum._type)[];

  return (
    <Menu withinPortal>
      <Menu.Target>
        <Badge
          color={statusColors[status]}
          rightSection={
            <ActionIcon size="xs" variant="transparent">
              <ChevronDownIcon
                width={14}
                height={14}
                stroke="black"
                strokeWidth={2}
              />
            </ActionIcon>
          }
          style={{ cursor: "pointer" }}
        >
          {status}
        </Badge>
      </Menu.Target>
      <Menu.Dropdown>
        {orderStatuses.map((s) => (
          <Menu.Item key={s} onClick={() => handleStatusChange(s)}>
            {s}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default OrderStatusBadge;
