// features/customers/order-detail-drawer.tsx
import { Drawer, Text, Title, Table } from "@mantine/core";
import { useOrderDetail } from "../api/customers-queries";

const OrderDetailDrawer = ({
  customerId,
  orderId,
  onClose,
  opened,
}: {
  customerId: string;
  orderId: string;
  onClose: () => void;
  opened: boolean;
}) => {
  const {
    data: orderDetail,
    isLoading,
    error,
  } = useOrderDetail(customerId, orderId);

  if (isLoading) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        title="Order Details"
        padding="lg"
      >
        <Text>Loading order details...</Text>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        title="Order Details"
        padding="lg"
      >
        <Text>Failed to load order details.</Text>
      </Drawer>
    );
  }

  if (!orderDetail) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        title="Order Details"
        padding="lg"
      >
        <Text>No details available for this order.</Text>
      </Drawer>
    );
  }

  const { order, items } = orderDetail;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Order Details"
      padding="xl"
      size="xl"
      offset={1}
      radius="md"
    
      overlayProps={{ backgroundOpacity: 0.2, blur: 1 }}
      styles={{
        content: {
          border: "0.25px solid var(--mantine-color-gray-3)",
        },
      }}
    >
      <Title order={3}>Order Information</Title>
      <Text>Order ID: {order.orderId}</Text>
      <Text>Total Amount: ${order.totalAmount.toFixed(2)}</Text> 
      <Text>Order Status: {order.orderStatus}</Text>
      <Text>Order Date: {new Date(order.orderDate).toLocaleDateString()}</Text>

      {order.updatedAt && (
        <Text>
          Updated At: {new Date(order.updatedAt).toLocaleDateString()}
        </Text>
      )}

      <Title order={3} mt="lg">
        Items
      </Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product ID</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Price</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((item) => (
            <Table.Tr key={item.orderItemId}>
              <Table.Td>{item.productId}</Table.Td>
              <Table.Td>{item.quantity}</Table.Td>
              <Table.Td>{item.price.toFixed(2)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Drawer>
  );
};

export default OrderDetailDrawer;
