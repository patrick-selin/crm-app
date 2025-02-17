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
} from "@mantine/core";
import { OrderStatusEnum } from "../../../schemas/order-schemas";
import {
  DocumentArrowDownIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

interface BulkActionsDrawerProps {
  selectedOrders: string[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>;
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

      <Text size="sm" mb="sm">
        Selected Orders: {selectedOrders.length}
      </Text>

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
