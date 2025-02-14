import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrderItems } from "../api/orders-queries";
import { useMantineTheme, useMantineColorScheme } from "@mantine/core";
import { Table, Text, Collapse, Button, Loader } from "@mantine/core";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import OrderStatusBadge from "./order-status-badge";
import { OrderStatusType, Order } from "../../../schemas/order-schemas";
import OrderItemsTable from "./orders-items-table";

interface OrderTableRowProps {
  order: Order & { customer: string };
  selectedOrders: string[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  selectedOrders,
  setSelectedOrders,
}) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { data: orderDetail, isLoading } = useOrderItems(
    expanded ? order.orderId : undefined
  );

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Table.Tr
        key={order.orderId}
        className={`tablerow ${
          selectedOrders.includes(order.orderId) ? "selected" : ""
        }`}
      >
        <Table.Td>
          <input
            type="checkbox"
            checked={selectedOrders.includes(order.orderId)}
            onChange={() => {
              setSelectedOrders((prev) =>
                prev.includes(order.orderId)
                  ? prev.filter((id) => id !== order.orderId)
                  : [...prev, order.orderId]
              );
            }}
          />
        </Table.Td>
        <Table.Td>
          <Text
            size="sm"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate(`/customers/${order.customerId}`)}
          >
            {order.customer}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text
            size="sm"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate(`/orders/${order.orderId}`)}
          >
            {order.orderId}
          </Text>
        </Table.Td>
        <Table.Td>${order.totalAmount}</Table.Td>
        <Table.Td>{new Date(order.orderDate).toLocaleDateString()}</Table.Td>
        <Table.Td>
          <OrderStatusBadge
            orderId={order.orderId}
            initialStatus={order.orderStatus as OrderStatusType}
          />
        </Table.Td>
        <Table.Td>
          <Button
            size="compact-xs"
            variant="outline"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? (
              <ChevronUpIcon width={16} />
            ) : (
              <ChevronDownIcon width={16} />
            )}
          </Button>
        </Table.Td>
      </Table.Tr>

      {expanded && (
        <Table.Tr>
          <Table.Td
            colSpan={7}
            style={{
              padding: 0,
              marginLeft: "1rem",
              backgroundColor:
                colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[1],
            }}
          >
            <Collapse in={expanded}>
              {isLoading ? (
                <Loader />
              ) : (
                <OrderItemsTable items={orderDetail?.items || []} />
              )}
            </Collapse>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
};

export default OrderTableRow;
