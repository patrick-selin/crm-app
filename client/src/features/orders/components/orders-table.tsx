// features/orders/orders-table.tsx
import { useState } from "react";
import { Table, Text } from "@mantine/core";
import { useOrders } from "../api/orders-queries";

const OrdersTable = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const {
    data: orders = { total: 0, page: 1, limit: 10, data: [] },
    isLoading,
    error,
  } = useOrders({
    
  });

  if (isLoading) return <Text>Loading orders...</Text>;
  if (error) return <Text>Error fetching orders.</Text>;

  return (
    <div>      
      <Text size="sm" mb="sm" pl="sm">
        Showing {orders.data.length} of {orders.total} orders
      </Text>

      <Table withRowBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Select</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Total Amount</Table.Th>
            <Table.Th>Order Date</Table.Th>
            <Table.Th>Payment Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.data.map((order) => (
            <Table.Tr key={order.orderId}>
              <Table.Td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.orderId)}
                  onChange={() =>
                    setSelectedOrders((prev) =>
                      prev.includes(order.orderId)
                        ? prev.filter((id) => id !== order.orderId)
                        : [...prev, order.orderId]
                    )
                  }
                />
              </Table.Td>
              <Table.Td>{`${order.customer.firstName} ${order.customer.lastName}`}</Table.Td>
              <Table.Td>{order.orderId}</Table.Td>
              <Table.Td>${order.totalAmount.toFixed(2)}</Table.Td>
              <Table.Td>{new Date(order.orderDate).toLocaleDateString()}</Table.Td>
              <Table.Td>{order.paymentStatus}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>


    </div>
  );
};

export default OrdersTable;
