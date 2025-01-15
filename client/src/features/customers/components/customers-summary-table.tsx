// features/customers/customers-summary-table.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCustomersSummary } from "../api/customers-queries";
import { Table, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import TableControls from "./table-controls";
import TablePagination from "./table-pagination";

const CustomersSummaryTable = () => {
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<string | null>("");
  const [limit, setLimit] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [debouncedSearch] = useDebouncedValue(searchInput, 500);

  const navigate = useNavigate();
  const {
    data: customersSummary = { total: 0, totalPages: 1, data: [] },
    isLoading,
    error,
  } = useCustomersSummary({
    search: debouncedSearch,
    sort: sort || "",
    limit,
    page: activePage,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching customer summary.</p>;

  return (
    <div>
      <TableControls
        search={searchInput}
        onSearchChange={setSearchInput}
        sort={sort}
        onSortChange={setSort}
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setActivePage(1);
        }}
        sortOptions={[
          { value: "firstName:asc", label: "First Name (A-Z)" },
          { value: "firstName:desc", label: "First Name (Z-A)" },
          { value: "lastName:asc", label: "Last Name (A-Z)" },
          { value: "lastName:desc", label: "Last Name (Z-A)" },
          { value: "lastOrderDate:desc", label: "Last Order (Newest)" },
          { value: "lastOrderDate:asc", label: "Last Order (Oldest)" },
          {
            value: "numOfOrders:desc",
            label: "Number of Orders (High to Low)",
          },
          { value: "numOfOrders:asc", label: "Number of Orders (Low to High)" },
          { value: "totalSpent:desc", label: "Total Spent (High to Low)" },
          { value: "totalSpent:asc", label: "Total Spent (Low to High)" },
        ]}
      />

      <Text size="sm" mb="sm" pl={"sm"}>
        Showing {customersSummary.data.length} of {customersSummary.total}{" "}
        customers
      </Text>

      <Table withRowBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Last Order</Table.Th>
            <Table.Th>Number of Orders</Table.Th>
            <Table.Th>Total Spent</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {customersSummary.data.map((customer) => (
            <Table.Tr
              key={customer.customerId}
              className="tablerow"
              onClick={() => navigate(`/customers/${customer.customerId}`)}
            >
              <Table.Td>
                {customer.firstName} {customer.lastName}
              </Table.Td>
              <Table.Td>{customer.email}</Table.Td>
              <Table.Td>
                {customer.lastOrderDate &&
                customer.lastOrderDate !== "No orders"
                  ? new Date(customer.lastOrderDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "N/A"}
              </Table.Td>
              <Table.Td>{customer.numOfOrders}</Table.Td>
              <Table.Td>{customer.totalSpent.toFixed(2)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <TablePagination
        total={Math.ceil(customersSummary.total / limit) || 1}
        value={activePage}
        onChange={setActivePage}
      />
    </div>
  );
};

export default CustomersSummaryTable;
