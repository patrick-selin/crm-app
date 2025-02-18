import { useState } from "react";
import {
  Drawer,
  Button,
  Select,
  Switch,
  Text,
  Group,
  LoadingOverlay,
  Divider,
  Table,
  // notifications,
} from "@mantine/core";
import { Order, OrderStatusEnum } from "../../../schemas/order-schemas";
import {
  DocumentArrowDownIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { useUpdateOrderStatus } from "../api/orders-queries";
import { notifications } from "@mantine/notifications";

interface BulkActionsDrawerProps {
  selectedOrders: Order[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  isOpen: boolean;
  onClose: () => void;
  actionType: "update-status" | "generate-files";
  onGenerateCSV: (includeItems: boolean) => void;
  onGeneratePDF: (includeItems: boolean) => void;
}

const BulkActionsDrawer: React.FC<BulkActionsDrawerProps> = ({
  selectedOrders,
  setSelectedOrders,
  isOpen,
  onClose,
  actionType,
  onGenerateCSV,
  onGeneratePDF,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [includeOrderItems, setIncludeOrderItems] = useState(false);

  const updateOrderStatus = useUpdateOrderStatus();

  const handleUpdateStatus = () => {
    if (!selectedStatus) return;

    updateOrderStatus.mutate(
      {
        orderIds: selectedOrders.map((order) => order.orderId),
        newStatus: selectedStatus,
      },
      {
        onSuccess: (data) => {
          const updatedCount = data.updatedCount ?? 0;

          notifications.show({
            title: "Success",
            message: `Successfully updated ${updatedCount} order(s) to "${selectedStatus}"`,
            color: "green",
          });

          setSelectedOrders([]);
          onClose();
        },
        onError: (error: any) => {
          let errorMessage = "Failed to update order status.";

          if (error.response) {
            const { status, data } = error.response;

            if (status === 400) {
              errorMessage =
                data.message ||
                "Invalid status change. Please check the allowed transitions.";
            } else if (status === 404) {
              errorMessage = "Some or all selected orders were not found.";
            } else if (status === 403) {
              errorMessage =
                "You do not have permission to perform this action.";
            }
          }

          notifications.show({
            title: "Error",
            message: errorMessage,
            color: "red",
          });
        },
      }
    );
  };

  const handleGenerateCSV = () => {
    onGenerateCSV(includeOrderItems);
    notifications.show({
      title: "CSV Generated",
      message: "Your CSV file has been generated",
      color: "blue",
    });
  };

  const handleGeneratePDF = () => {
    onGeneratePDF(includeOrderItems);
    notifications.show({
      title: "PDF Generated",
      message: "Your PDF file has been generated",
      color: "blue",
    });
  };

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      title={`Bulk Actions (${selectedOrders.length} selected)`}
      position="right"
      size="lg"
    >
      <LoadingOverlay visible={updateOrderStatus.isPending} />

      <Text size="md" mt="md" mb="sm">
        Selected Orders:
      </Text>
      <Table striped mb="xl">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Total Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {selectedOrders.map((order) => (
            <Table.Tr key={order.orderId}>
              <Table.Td>{order.orderId}</Table.Td>
              <Table.Td>{order.orderStatus}</Table.Td>
              <Table.Td>${order.totalAmount}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {actionType === "update-status" && (
        <>
          <Select
            label="Change Order Status"
            placeholder="Select new status"
            data={OrderStatusEnum.options.map((status) => ({
              value: status,
              label: status,
            }))}
            value={selectedStatus}
            onChange={setSelectedStatus}
            disabled={updateOrderStatus.isPending}
          />
          <Button
            mt="sm"
            fullWidth
            onClick={handleUpdateStatus}
            disabled={!selectedStatus || updateOrderStatus.isPending}
            leftSection={<CheckCircleIcon style={{ width: 20, height: 20 }} />}
          >
            {updateOrderStatus.isPending ? "Updating..." : "Update Status"}
          </Button>
        </>
      )}

      {actionType === "generate-files" && (
        <>
          <Switch
            label="Include Order Items in File"
            checked={includeOrderItems}
            onChange={(event) =>
              setIncludeOrderItems(event.currentTarget.checked)
            }
            mt="sm"
          />
          <Divider my="sm" />
          <Group mt="sm">
            <Button
              fullWidth
              onClick={handleGenerateCSV}
              leftSection={
                <DocumentArrowDownIcon style={{ width: 20, height: 20 }} />
              }
            >
              Generate CSV
            </Button>
            <Button
              fullWidth
              color="red"
              onClick={handleGeneratePDF}
              leftSection={
                <DocumentArrowDownIcon style={{ width: 20, height: 20 }} />
              }
            >
              Generate PDF
            </Button>
          </Group>
        </>
      )}
    </Drawer>
  );
};

export default BulkActionsDrawer;
