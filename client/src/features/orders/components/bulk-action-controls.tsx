import { Button, Tooltip, Group } from "@mantine/core";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import BulkActionsDrawer from "./bulk-actions-drawer";

interface BulkActionsControlsProps {
  selectedOrders: string[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>;
  modalOpened: boolean;
  open: () => void;
  close: () => void;
}

const BulkActionsControls: React.FC<BulkActionsControlsProps> = ({
  selectedOrders,
  modalOpened,
  open,
  close,
}) => {
  return (
    <>
      <Group align="apart" mt="md">
        <Tooltip
          label="Select at least one order to generate files"
          disabled={selectedOrders.length > 0}
        >
          <Button
            leftSection={<DocumentArrowDownIcon className="w-5 h-5" />}
            onClick={open}
            disabled={selectedOrders.length === 0}
          >
            Generate Files
          </Button>
        </Tooltip>
      </Group>

      <BulkActionsDrawer
        selectedOrders={selectedOrders}
        setSelectedOrders={() => {}}
        isOpen={modalOpened}
        onClose={close}
        onUpdateStatus={() => {}}
        onGenerateCSV={() => {}}
        onGeneratePDF={() => {}}
      />
    </>
  );
};

export default BulkActionsControls;
