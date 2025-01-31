// features/orders/orders-summary.tsx
import { useOrdersSummary } from "../api/orders-queries";
import { Card, Text, Group, Table } from "@mantine/core";

const OrdersSummary = () => {
  const { data: summary, isLoading, error } = useOrdersSummary();

  if (isLoading) return <Text>Loading summary...</Text>;
  if (error) return <Text>Error fetching orders summary.</Text>;

  return (
    <div>
      <Group mb="md">
        <Card shadow="sm" padding="lg">
          <Text size="lg" fw={500}>Total Orders: {summary.totalOrders}</Text>
        </Card>
        <Card shadow="sm" padding="lg">
          <Text size="lg" fw={500}>Total Revenue: ${summary.totalRevenue.toFixed(2)}</Text>
        </Card>
      </Group>
      
      <Text size="lg" fw={500} mb="sm">Orders Per Month</Text>
      <Table withRowBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Month</Table.Th>
            <Table.Th>Orders</Table.Th>
            <Table.Th>Revenue</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {summary.ordersPerMonth.map((month) => (
            <Table.Tr key={month.month}>
              <Table.Td>{month.month}</Table.Td>
              <Table.Td>{month.count}</Table.Td>
              <Table.Td>${month.revenue.toFixed(2)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      
      <Text size="lg" fw={500} mt="lg" mb="sm">Most Ordered Products</Text>
      <Table withRowBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Total Sold</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {summary.mostOrderedProducts.map((product) => (
            <Table.Tr key={product.productId}>
              <Table.Td>{product.name}</Table.Td>
              <Table.Td>{product.totalSold}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default OrdersSummary;
