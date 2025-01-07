// features/customers/customers-list.tsx
import { useCustomersSummary } from "./customers-queries";
import { Table } from "@mantine/core";

const CustomersList = () => {
  const { data: customersSummary, isLoading, error } = useCustomersSummary();
  console.log(customersSummary);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching customers.</p>;

  const rows = customersSummary?.map((customer) => (
    <Table.Tr key={customer.customerId}>
      <Table.Td>
        {customer.firstName} {customer.lastName}
      </Table.Td>
      <Table.Td>{customer.email}</Table.Td>
      <Table.Td>{customer.lastOrderDate || "N/A"}</Table.Td>
      <Table.Td>{customer.numOfOrders}</Table.Td>
      <Table.Td>{customer.totalSpent.toFixed(2)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <h2>Customers</h2>
      {/* <div>SORT, FILTERs, SEARCH by name</div> */}
      <div>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Last Order</Table.Th>
              {/* Payment status: "Paid", "Pending", "Overdue". */}
              <Table.Th>Number of Orders</Table.Th>
              <Table.Th>Total Spent</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
      {/* <p>PAGINATION</p> */}
    </div>
  );
};

export default CustomersList;
