import { useNavigate } from "react-router";
import { Table, Title } from "@mantine/core";
import { Order } from "../../../schemas/order-schemas";

const CustomerOrders = ({ orders }: { orders: Order[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Title order={2}>Customer orders</Title>
      <Table withRowBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Total Amount</Table.Th>
            <Table.Th>Order Status</Table.Th>
            <Table.Th>Order Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.map((order) => (
            <Table.Tr
              key={order.orderId}
              className="tablerow"
              onClick={() => {
                const route = `/orders/${order.orderId}`;
                navigate(route);
              }}
              style={{ cursor: "pointer" }}
            >
              <Table.Td style={{ textDecoration: "underline" }}>
                {order.orderId}
              </Table.Td>
              <Table.Td>${order.totalAmount.toFixed(2)}</Table.Td>
              <Table.Td>{order.orderStatus}</Table.Td>
              <Table.Td>
                {new Date(order.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default CustomerOrders;
