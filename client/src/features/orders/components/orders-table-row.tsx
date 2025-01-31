import { Table } from "@mantine/core";
import OrderStatusBadge from "./order-status-badge";
// import OrderStatusBadge from "./order-status-badge";

interface OrderTableRowProps {
    order: {
      orderId: string;
      customer: { firstName: string; lastName: string };
      totalAmount: number;
      orderDate: string;
      paymentStatus: string;
    };
    selectedOrders: string[];
    setSelectedOrders: (value: string[]) => void;
  }

  
  const OrderTableRow: React.FC<OrderTableRowProps> = ({order, selectedOrders, setSelectedOrders }) => {
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
      <Table.Td>
        <OrderStatusBadge orderId={order.orderId} initialStatus={order.paymentStatus} />
      </Table.Td>
    </Table.Tr>
  );
};

export default OrderTableRow;
