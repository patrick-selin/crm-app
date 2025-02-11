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
  const [limit, setLimit] = useState<number>(10);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [modalOpened, { open, close }] = useDisclosure(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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
    limit,
    dateRange,
  });

  const orders = data?.pages.flatMap((page) => page.data) || [];

  // When the user types (searchInput changes), ensure the search input stays focused.
  // Not working, loses the focus after re-render. Remember to debug.
  useEffect(() => {
    if (
      searchInputRef.current &&
      document.activeElement !== searchInputRef.current
    ) {
      searchInputRef.current.focus();
    }
  }, [searchInput]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleLoadMore = () => {
    fetchNextPage().then(() => {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
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
        limit={limit}
        onLimitChange={setLimit}
      />

      <OrdersTableBody
        orders={orders.map((o) => ({
          ...o,
          items: o.items ?? [],
        }))}
        total={data?.pages[0]?.total || 0}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <div ref={bottomRef} />

      <Group justify="center" align="center" mt="md">
        {hasNextPage && (
          <Button onClick={handleLoadMore} loading={isFetchingNextPage}>
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
