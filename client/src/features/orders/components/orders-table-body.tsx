import { Table, Text } from "@mantine/core";
import { SortableHeader } from "./sortable-header";
import OrderTableRow from "./orders-table-row";

interface OrdersTableBodyProps {
  orders: {
    orderId: string;
    customer: string;
    totalAmount: string;
    orderDate: string;
    orderStatus: string;
  }[];
  total: number;
  selectedOrders: string[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

const OrdersTableBody: React.FC<OrdersTableBodyProps> = ({
  orders,
  total,
  selectedOrders,
  setSelectedOrders,
  sortBy,
  sortOrder,
  onSort,
}) => {
  return (
    <div>
      <Text size="sm" mb="sm" pl="sm">
        Showing {orders.length} of {total} orders
      </Text>
      <Table withRowBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Select</Table.Th>
            <SortableHeader
              column="customer"
              label="Customer"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableHeader
              column="orderId"
              label="Order ID"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableHeader
              column="totalAmount"
              label="Total Amount"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableHeader
              column="orderDate"
              label="Order Date"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableHeader
              column="orderStatus"
              label="Order Status"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
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
