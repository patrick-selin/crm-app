import { Drawer, Text } from "@mantine/core";

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
  isOpen,
  onClose,
}) => {
  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      title={`Bulk Actions (${selectedOrders.length} selected)`}
      position="right"
      size="lg"
    >
      <Text size="sm" mb="sm">
        Selected Orders: {selectedOrders.length}
      </Text>
    </Drawer>
  );
};

export default BulkActionsDrawer;
