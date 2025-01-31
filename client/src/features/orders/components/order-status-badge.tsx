import { useState } from "react";
import { Badge, Menu, ActionIcon } from "@mantine/core";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const statusColors: Record<string, string> = {
  Pending: "yellow",
  Completed: "green",
  Overdue: "red",
};

interface OrderStatusBadgeProps {
  orderId: string;
  initialStatus: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({  initialStatus }) => {
  const [status, setStatus] = useState(initialStatus);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // TODO: Send API request to update status
  };

  return (
    <Menu withinPortal>
      <Menu.Target>
        <Badge
          color={statusColors[status]}
          rightSection={
            <ActionIcon size="xs" variant="transparent">
              <ChevronDownIcon className="h-4 w-4" stroke="black" strokeWidth={2} />
            </ActionIcon>
          }
          style={{ cursor: "pointer" }}
        >
          {status}
        </Badge>
      </Menu.Target>
      <Menu.Dropdown>
        {["Pending", "Completed", "Overdue"].map((s) => (
          <Menu.Item key={s} onClick={() => handleStatusChange(s)}>
            {s}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default OrderStatusBadge;
