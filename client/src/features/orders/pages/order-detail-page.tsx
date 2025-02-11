import { useParams } from "react-router";
import { useOrderDetail } from "../../orders/api/orders-queries";
import { Loader, Text, Title, Table, Image } from "@mantine/core";

const OrderDetailPage = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const { data: orderDetail, isLoading, error } = useOrderDetail(orderId!);

  if (isLoading) return <Loader />;
  if (error || !orderDetail) return <Text>Error loading order details.</Text>;

  const { order, items } = orderDetail;

  return (
    <div>
      <Title order={2}>Order Details</Title>
      <Text>Order ID: {order.orderId}</Text>
      <Text>Total Amount: ${order.totalAmount.toFixed(2)}</Text>
      <Text>Order Status: {order.orderStatus}</Text>
      <Text>Order Date: {new Date(order.orderDate).toLocaleDateString()}</Text>

      <Title order={3} mt="lg">
        Items
      </Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Image</Table.Th>
            <Table.Th>Product Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>SKU</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Quantity</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <Table.Tr key={item.productId}>
                <Table.Td>
                  <Image
                    src={item.productImage || "/placeholder.png"}
                    alt={item.name}
                    width={40}
                    height={40}
                  />
                </Table.Td>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.category || "N/A"}</Table.Td>
                <Table.Td>{item.sku}</Table.Td>
                <Table.Td>${item.price.toFixed(2)}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text size="sm" color="gray">
                  No items in this order.
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default OrderDetailPage;
