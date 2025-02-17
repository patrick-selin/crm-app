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
} from "@mantine/core";
import { Order, OrderStatusEnum } from "../../../schemas/order-schemas";
import {
  DocumentArrowDownIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

interface BulkActionsDrawerProps {
  selectedOrders: Order[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  isOpen: boolean;
  onClose: () => void;
  actionType: "update-status" | "generate-files";
  onUpdateStatus: (status: string) => void;
  onGenerateCSV: (includeItems: boolean) => void;
  onGeneratePDF: (includeItems: boolean) => void;
}

const BulkActionsDrawer: React.FC<BulkActionsDrawerProps> = ({
  selectedOrders,
  setSelectedOrders,
  isOpen,
  onClose,
  actionType,
  onUpdateStatus,
  onGenerateCSV,
  onGeneratePDF,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [includeOrderItems, setIncludeOrderItems] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdateStatus = () => {
    if (!selectedStatus) return;
    setIsProcessing(true);
    onUpdateStatus(selectedStatus);
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedOrders([]);
      onClose();
    }, 1500);
  };

  const handleGenerateCSV = () => {
    setIsProcessing(true);
    onGenerateCSV(includeOrderItems);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  const handleGeneratePDF = () => {
    setIsProcessing(true);
    onGeneratePDF(includeOrderItems);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      title={`Bulk Actions (${selectedOrders.length} selected)`}
      position="right"
      size="lg"
    >
      <LoadingOverlay visible={isProcessing} />

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
            onChange={(value) => setSelectedStatus(value || "")}
            disabled={isProcessing}
          />
          <Button
            mt="sm"
            fullWidth
            onClick={handleUpdateStatus}
            disabled={!selectedStatus || isProcessing}
            leftSection={<CheckCircleIcon style={{ width: 20, height: 20 }} />}
          >
            Update Status
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
              disabled={isProcessing}
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
              disabled={isProcessing}
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
