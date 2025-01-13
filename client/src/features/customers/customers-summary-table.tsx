// features/customers/customers-summary-table.tsx
import { Table } from "@mantine/core";
import { useCustomersSummary } from "./customers-queries";
import { useNavigate } from "react-router";
import classes from "./customers-summary-table.module.css";
import TableControls from "./table-controls";

const CustomersSummaryTable = () => {
  const { data: customersSummary, isLoading, error } = useCustomersSummary();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching customers.</p>;

  const rows = customersSummary?.map((customer) => (
    <Table.Tr
      key={customer.customerId}
      className={classes.tablerow}
      onClick={() => navigate(`/customers/${customer.customerId}`)}
    >
      <Table.Td>
        {customer.firstName} {customer.lastName}
      </Table.Td>
      <Table.Td>{customer.email}</Table.Td>
      <Table.Td>
        {customer.lastOrderDate && customer.lastOrderDate !== "No orders"
          ? new Date(customer.lastOrderDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A"}
      </Table.Td>
      <Table.Td>{customer.numOfOrders}</Table.Td>
      <Table.Td>{customer.totalSpent.toFixed(2)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <h2>Customers</h2>
      {/* <div>SORT, FILTERs, SEARCH by name</div> */}
      <TableControls />
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
      {/* <p>PAGINATION numbers </p> */}
    </div>
  );
};

export default CustomersSummaryTable;
