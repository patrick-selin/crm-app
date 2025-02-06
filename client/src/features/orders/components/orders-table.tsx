import { useState } from "react";
import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useOrders } from "../api/orders-queries";
import OrderTableControls from "./orders-table-controls";
import OrdersTableBody from "./orders-table-body";
import BulkActionsControls from "./bulk-action-controls";

const OrdersTable = () => {
  const [searchInput, setSearchInput] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [sortBy, setSortBy] = useState<string>("orderDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [modalOpened, { open, close }] = useDisclosure(false);

  console.log(`DATA RANGE from ORDER-TABLE :: ${dateRange}`);
  
  const {
    data: orders = { total: 0, page: 1, limit: 10, data: [] },
    isLoading,
    error,
  } = useOrders({ search: searchInput, dateRange, sort: `${sortBy}:${sortOrder}`, page });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  if (isLoading) return <Text>Loading orders...</Text>;
  if (error) return <Text>Error fetching orders.</Text>;

  return (
    <div>
      <OrderTableControls
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        dateRange={dateRange}
        setDateRange={setDateRange}
        page={page}
        setPage={setPage}
        total={orders.total}
      />
      <OrdersTableBody
        orders={orders.data}
        total={orders.total}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
      <BulkActionsControls
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
        modalOpened={modalOpened}
        open={open}
        close={close}
      />
    </div>
  );
};

export default OrdersTable;