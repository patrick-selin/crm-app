import { Table, Image, Text } from "@mantine/core";
import { OrderItem } from "../../../schemas/order-schemas";

interface OrderItemsTableProps {
  items: OrderItem[];
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  return (
    <Table withRowBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ paddingLeft: "1.5rem" }}>Image</Table.Th>
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
            <Table.Tr key={item.orderItemId}>
              <Table.Td style={{ paddingLeft: "1.5rem" }}>
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
              <Table.Td>${item.price}</Table.Td>
              <Table.Td>{item.quantity}</Table.Td>
            </Table.Tr>
          ))
        ) : (
          <Table.Tr>
            <Table.Td colSpan={6} style={{ paddingLeft: "1.5rem" }}>
              <Text size="sm">Order has no order items.</Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
};

export default OrderItemsTable;
