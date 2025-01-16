// features/customers/customers-table.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCustomers } from "../api/customers-queries";
import { Table, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import TableControls from "./table-controls";
import TablePagination from "./table-pagination";

const CustomersTable = () => {
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<string | null>("");
  const [limit, setLimit] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [debouncedSearch] = useDebouncedValue(searchInput, 500);

  const navigate = useNavigate();
  const {
    data: customers = { total: 0, page: 1, limit: 10, data: [] },
    isLoading,
    error,
  } = useCustomers({
    search: debouncedSearch,
    sort: sort || "",
    limit,
    page: activePage,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching customers.</p>;

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
          { value: "email:asc", label: "Email (A-Z)" },
          { value: "email:desc", label: "Email (Z-A)" },
          { value: "city:asc", label: "City (A-Z)" },
          { value: "city:desc", label: "City (Z-A)" },
          { value: "country:asc", label: "Country (A-Z)" },
          { value: "country:desc", label: "Country (Z-A)" },
          { value: "createdAt:desc", label: "Created Date (Newest)" },
          { value: "createdAt:asc", label: "Created Date (Oldest)" },
        ]}
      />

      <Text size="sm" mb="sm" pl={"sm"}>
        Showing {customers.data.length} of {customers.total} customers
      </Text>

      <Table withRowBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>City</Table.Th>
            <Table.Th>Postal Code</Table.Th>
            <Table.Th>Country</Table.Th>
            <Table.Th>Created At</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {customers.data.map((customer) => (
            <Table.Tr
              key={customer.customerId}
              className="tablerow"
              onClick={() => navigate(`/customers/${customer.customerId}`)}
            >
              <Table.Td>
                {customer.firstName} {customer.lastName}
              </Table.Td>
              <Table.Td>{customer.email}</Table.Td>
              <Table.Td>{customer.phone}</Table.Td>
              <Table.Td>{customer.address}</Table.Td>
              <Table.Td>{customer.city}</Table.Td>
              <Table.Td>{customer.postalCode}</Table.Td>
              <Table.Td>{customer.country}</Table.Td>
              <Table.Td>
                {new Date(customer.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <TablePagination
        total={Math.ceil(customers.total / limit) || 1}
        value={activePage}
        onChange={setActivePage}
      />
    </div>
  );
};

export default CustomersTable;
