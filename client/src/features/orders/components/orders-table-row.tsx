import { useState } from "react";
import { useMantineTheme, useMantineColorScheme } from "@mantine/core";
import { Table, Image, Text, Collapse, Button } from "@mantine/core";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";
import OrderStatusBadge from "./order-status-badge";
import { OrderStatusType } from "../../../schemas/order-schemas";

interface OrderTableRowProps {
  order: {
    orderId: string;
    customerId: string;
    customer: string;
    totalAmount: string;
    orderDate: string;
    orderStatus: string;
    items: {
      orderItemId: string;
      productId: string;
      name: string;
      category: string;
      sku: string;
      price: number;
      productImage: string;
      quantity: number;
    }[];
  };
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
  const orderItems = order.items || [];

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Table.Tr key={order.orderId}>
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
        <Table.Td>${parseFloat(order.totalAmount).toFixed(2)}</Table.Td>
        <Table.Td>{new Date(order.orderDate).toLocaleDateString()}</Table.Td>
        <Table.Td>
          <OrderStatusBadge
            orderId={order.orderId}
            initialStatus={order.orderStatus as OrderStatusType}
          />
        </Table.Td>
        <Table.Td>
          <Button
            size="xs"
            variant="light"
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

      <Table.Tr>
        <Table.Td
          colSpan={7}
          style={{
            padding: 0,
            marginleft: "1rem",
            backgroundColor:
              colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[1],
          }}
        >
          <Collapse in={expanded}>
            <Table withRowBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ paddingLeft: "1.5rem" }}>Image</Table.Th>
                  <Table.Th>Product Name</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>SKU</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <Table.Tr key={item.orderItemId}>
                      <Table.Td style={{ paddingLeft: "1.5rem" }}>
                        <Image
                          src={item.productImage || "/placeholder.png"}
                          alt={item.name}
                          width={40}
                          height={40}
                        />
                      </Table.Td>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.category || "N/A"}</Table.Td>
                      <Table.Td>{item.sku}</Table.Td>
                      <Table.Td>${item.price.toFixed(2)}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={6} style={{ paddingLeft: "1.5rem" }}>
                      <Text
                        size="sm"
                        style={{
                          color:
                            colorScheme === "dark"
                              ? theme.colors.gray[3]
                              : theme.colors.gray[8],
                        }}
                      >
                        Order has no order items.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Collapse>
        </Table.Td>
      </Table.Tr>
    </>
  );
};

export default OrderTableRow;
