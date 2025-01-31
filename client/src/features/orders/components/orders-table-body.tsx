import { Table } from "@mantine/core";
import OrderTableRow from "./orders-table-row";

const OrdersTableBody = ({ orders, selectedOrders, setSelectedOrders }) => {
  return (
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
  );
};

export default OrdersTableBody;
