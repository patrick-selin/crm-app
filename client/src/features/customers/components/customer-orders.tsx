import { Table } from "@mantine/core";
import { Order } from "../../../schemas/order-schemas";

const CustomerOrders = ({ orders }: { orders: Order[] }) => (
  <Table>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Order ID</Table.Th>
        <Table.Th>Total Amount</Table.Th>
        <Table.Th>Payment Status</Table.Th>
        <Table.Th>Order Date</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {orders.map((order) => (
        <Table.Tr key={order.orderId}>
          <Table.Td>{order.orderId}</Table.Td>
          <Table.Td>{order.totalAmount}</Table.Td>
          <Table.Td>{order.paymentStatus}</Table.Td>
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
);

export default CustomerOrders;
