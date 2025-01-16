// features/customers/add-customer-modal.tsx
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAddCustomer } from "../api/customers-queries";
import { CreateCustomerSchema } from "../../../schemas/customer-schemas";

const AddCustomerModal = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  const form = useForm({
    validate: zodResolver(CreateCustomerSchema),
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const mutation = useAddCustomer();

  const handleSubmit = (values: z.infer<typeof CreateCustomerSchema>) => {
    mutation.mutate(values, {
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Customer added successfully!",
          color: "green",
        });
        form.reset();
        onClose();
      },
      onError: (error) => {
        notifications.show({
          title: "Error",
          message:
            error instanceof Error ? error.message : "Failed to add customer.",
          color: "red",
        });
      },
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add New Customer" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="First Name"
          placeholder="First Name"
          withAsterisk
          mb="sm"
          {...form.getInputProps("firstName")}
        />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          withAsterisk
           mb="sm"
          {...form.getInputProps("lastName")}
        />
        <TextInput
          label="Email"
          placeholder="Email"
          withAsterisk
           mb="sm"
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Phone"
          placeholder="Phone"
          {...form.getInputProps("phone")}
        />
        <TextInput
          label="Address"
          placeholder="Address"
          withAsterisk
           mb="sm"
          {...form.getInputProps("address")}
        />
        <TextInput
          label="City"
          placeholder="City"
          withAsterisk
           mb="sm"
          {...form.getInputProps("city")}
        />
        <TextInput
          label="Postal Code"
          placeholder="Postal Code"
          withAsterisk
           mb="sm"
          {...form.getInputProps("postalCode")}
        />
        <TextInput
          label="Country"
          placeholder="Country"
  
          {...form.getInputProps("country")}
        />
        <Group mt="md" pt={"sm"} align="right">
          <Button type="submit" loading={mutation.isPending}>
            Add
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;
