import { useState, useRef, useEffect } from "react";
import { Text, Button, Group, Loader, Tooltip } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useOrdersInfinite } from "../api/orders-queries";
import OrderTableControls from "./orders-table-controls";
import OrdersTableBody from "./orders-table-body";
import BulkActionsDrawer from "./bulk-actions-drawer";
import { useDisclosure } from "@mantine/hooks";
import {
  DocumentArrowDownIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Order } from "../../../schemas/order-schemas";

const OrdersTable = () => {
  const [searchInput, setSearchInput] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [sortBy, setSortBy] = useState<string>("orderDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState<number>(10);
  // const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [bulkActionType, setBulkActionType] = useState<
    "update-status" | "generate-files"
  >("update-status");
  const [bulkDrawerOpen, { open, close }] = useDisclosure(false);

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

  const openBulkActionsDrawer = (
    action: "update-status" | "generate-files"
  ) => {
    setBulkActionType(action);
    open();
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

      <Group justify="space-between" align="center" mb="sm">
        <Text size="sm" pl="sm">
          Showing {orders.length} of {data?.pages[0]?.total || 0} orders
        </Text>

        <Group>
          <Tooltip label="Select Orders to Update Order Status">
            <Button
              leftSection={
                <CheckCircleIcon style={{ width: 20, height: 20 }} />
              }
              onClick={() => openBulkActionsDrawer("update-status")}
              disabled={selectedOrders.length === 0}
              variant="outline"
            >
              Bulk Update Status
            </Button>
          </Tooltip>

          <Tooltip label="Select Orders to Generate Files">
            <Button
              leftSection={
                <DocumentArrowDownIcon style={{ width: 20, height: 20 }} />
              }
              onClick={() => openBulkActionsDrawer("generate-files")}
              disabled={selectedOrders.length === 0}
              color="orange"
              variant="outline"
            >
              Generate CSV / PDF
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <OrdersTableBody
        orders={orders.map((o) => ({
          ...o,
          items: o.items ?? [],
        }))}
        // total={data?.pages[0]?.total || 0}
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

      <BulkActionsDrawer
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
        isOpen={bulkDrawerOpen}
        onClose={close}
        actionType={bulkActionType}
        onUpdateStatus={(status) => console.log("Updating status to:", status)}
        onGenerateCSV={(includeItems) =>
          console.log("Generating CSV, Include Items:", includeItems)
        }
        onGeneratePDF={(includeItems) =>
          console.log("Generating PDF, Include Items:", includeItems)
        }
      />
    </div>
  );
};

export default OrdersTable;
