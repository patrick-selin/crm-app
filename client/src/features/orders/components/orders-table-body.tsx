import { Table, Text } from "@mantine/core";
import OrderTableRow from "./orders-table-row";

interface OrdersTableBodyProps {
  orders: {
    orderId: string;
    customer: { firstName: string; lastName: string };
    totalAmount: number;
    orderDate: string;
    paymentStatus: string;
  }[];
  total: number;
  selectedOrders: string[];
  setSelectedOrders: (value: string[]) => void;
}


const OrdersTableBody: React.FC<OrdersTableBodyProps> = ({ orders, selectedOrders, setSelectedOrders }) => {
  return (
    <div>
      <Text size="sm" mb="sm" pl="sm">
        Showing {orders.length} of {orders.total} orders
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
          {orders.map((order) => (
            <OrderTableRow
              key={order.orderId}
              order={order}
              selectedOrders={selectedOrders}
              setSelectedOrders={setSelectedOrders}
            />
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default OrdersTableBody;
