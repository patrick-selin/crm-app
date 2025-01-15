import { useState } from "react";
import { Table, Title } from "@mantine/core";
import OrderDetailDrawer from "../../customers/components/order-detail-drawer";
import { Order } from "../../../schemas/order-schemas";

const CustomerOrders = ({ orders }: { orders: Order[] }) => {
  const [selectedOrder, setSelectedOrder] = useState<null | string>(null);

  return (
    <div>
      <Title order={2}>Customer orders</Title>
      <Table withRowBorders withTableBorder>
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
            <Table.Tr
              key={order.orderId}
              className="tablerow"
              onClick={() => setSelectedOrder(order.orderId)}
            >
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
      {selectedOrder && (
        <OrderDetailDrawer
          orderId={selectedOrder}
          customerId={orders[0].customerId}
          opened={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
      s
    </div>
  );
};

export default CustomerOrders;
