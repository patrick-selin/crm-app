import { Modal, Button, Group, Text } from "@mantine/core";
import { useDeleteCustomer } from "../api/customers-queries";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";

const DeleteCustomerModal = ({
  opened,
  onClose,
  customerId,
}: {
  opened: boolean;
  onClose: () => void;
  customerId: string;
}) => {
  const mutation = useDeleteCustomer();
  const navigate = useNavigate();

  const handleDelete = () => {
    mutation.mutate(customerId, {
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Customer deleted successfully!",
          color: "green",
        });
        onClose();
        navigate("/customers");
      },
      onError: (error) => {
        notifications.show({
          title: "Error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete customer.",
          color: "red",
        });
      },
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Delete" centered>
      <Text>
        Are you sure you want to delete this customer? This action cannot be
        undone.
      </Text>
      <Group mt="md">
        <Button color="red" onClick={handleDelete} loading={mutation.isPending}>
          Delete
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteCustomerModal;
