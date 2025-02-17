import { Table } from "@mantine/core";
import { SortableHeader } from "./sortable-header";
import OrderTableRow from "./orders-table-row";
import { Order } from "../../../schemas/order-schemas";

interface OrdersTableBodyProps {
  orders: Order[];
  selectedOrders: string[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

const OrdersTableBody: React.FC<OrdersTableBodyProps> = ({
  orders,
  selectedOrders,
  setSelectedOrders,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const allSelected =
    orders.length > 0 && selectedOrders.length === orders.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.orderId));
    }
  };

  return (
    <div>
      <Table withRowBorders withTableBorder className="orders-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
            </Table.Th>
            <SortableHeader
              column="customer"
              label="Customer"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <Table.Th>Order ID</Table.Th>
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
