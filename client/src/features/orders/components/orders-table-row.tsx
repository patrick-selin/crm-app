import { Table } from "@mantine/core";
// import OrderStatusBadge from "./order-status-badge";

const OrderTableRow = ({ order, selectedOrders, setSelectedOrders }) => {
  return (
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

    </Table.Tr>
  );
};

export default OrderTableRow;
