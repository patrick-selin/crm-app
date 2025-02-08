import { useState, useRef, useEffect } from "react";
import { Text, Button, Group, Loader } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useOrdersInfinite } from "../api/orders-queries";
import OrderTableControls from "./orders-table-controls";
import OrdersTableBody from "./orders-table-body";
import BulkActionsControls from "./bulk-action-controls";
import { useDisclosure } from "@mantine/hooks";

const OrdersTable = () => {
  const [searchInput, setSearchInput] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [sortBy, setSortBy] = useState<string>("orderDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [debouncedSearch] = useDebouncedValue(searchInput, 500);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useOrdersInfinite({
    search: debouncedSearch,
    sort: `${sortBy}:${sortOrder}`,
    dateRange,
  });

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [data]);

  const orders = data?.pages.flatMap((page) => page.data) || [];

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  if (isLoading) return <Loader color="blue" />;
  if (error) return <Text>Error fetching orders.</Text>;

  return (
    <div>
      <OrderTableControls
        ref={searchInputRef}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <OrdersTableBody
        orders={orders}
        total={data?.pages[0]?.total || 0}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <Group justify="center" align="center" mt="md">
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
            Load More
          </Button>
        )}
      </Group>

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
