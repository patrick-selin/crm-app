import { Button, Modal, Text, Group } from "@mantine/core";

interface BulkActionsControlsProps {
  selectedOrders: string[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>;
  modalOpened: boolean;
  open: () => void;
  close: () => void;
}

const BulkActionsControls: React.FC<BulkActionsControlsProps> = ({
  selectedOrders,
  setSelectedOrders,
  modalOpened,
  open,
  close,
}) => {
  return (
    <>
      <Button
        mt="md"
        color="red"
        disabled={!selectedOrders.length}
        onClick={open}
      >
        Bulk Cancel Orders
      </Button>

      <Modal opened={modalOpened} onClose={close} title="Confirm Bulk Action">
        <Text>
          Are you sure you want to cancel {selectedOrders.length} orders?
        </Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              console.log("Cancelled orders:", selectedOrders);
              setSelectedOrders([]);
              close();
            }}
          >
            Confirm
          </Button>
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default BulkActionsControls;
