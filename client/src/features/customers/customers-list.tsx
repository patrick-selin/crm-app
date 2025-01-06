// features/customers/customers-list.tsx
import { useState } from "react";
import { useCustomers } from "./customers-queries";
import { Table } from "@mantine/core";
import mockCustomers from "../../utils/mockCustomersData";


const CustomersList = () => {
  const rows = mockCustomers.map((customer) => (
    <Table.Tr key={customer.name}>
      <Table.Td>{customer.name}</Table.Td>
      <Table.Td>{customer.email}</Table.Td>
      <Table.Td>{customer.last_order || "N/A"}</Table.Td>
      <Table.Td>{customer.num_orders}</Table.Td>
      <Table.Td>{customer.total_spent.toFixed(2)}</Table.Td>
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
