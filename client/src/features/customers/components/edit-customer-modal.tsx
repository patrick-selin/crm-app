import { useForm, zodResolver } from "@mantine/form";
import { Modal, TextInput, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useUpdateCustomer } from "../api/customers-queries";
import {
  CreateCustomer,
  CreateCustomerSchema,
} from "../../../schemas/customer-schemas";
import { Customer } from "../../../schemas/customer-schemas";

const EditCustomerModal = ({
  opened,
  onClose,
  customer,
}: {
  opened: boolean;
  onClose: () => void;
  customer: Customer;
}) => {
  const form = useForm({
    validate: zodResolver(CreateCustomerSchema),
    initialValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
      country: customer.country,
    },
  });

  const mutation = useUpdateCustomer();

  const handleSubmit = (values: CreateCustomer) => {
    mutation.mutate(
      { id: customer.customerId, ...values },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Customer updated successfully!",
            color: "green",
          });
          onClose();
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message:
              error instanceof Error
                ? error.message
                : "Failed to update customer.",
            color: "red",
          });
        },
      }
    );
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Customer" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="First Name"
          withAsterisk
          {...form.getInputProps("firstName")}
        />
        <TextInput
          label="Last Name"
          withAsterisk
          {...form.getInputProps("lastName")}
        />
        <TextInput
          label="Email"
          withAsterisk
          {...form.getInputProps("email")}
        />
        <TextInput label="Phone" {...form.getInputProps("phone")} />
        <TextInput
          label="Address"
          withAsterisk
          {...form.getInputProps("address")}
        />
        <TextInput label="City" withAsterisk {...form.getInputProps("city")} />
        <TextInput
          label="Postal Code"
          withAsterisk
          {...form.getInputProps("postalCode")}
        />
        <TextInput label="Country" {...form.getInputProps("country")} />
        <Group mt="md">
          <Button type="submit" loading={mutation.isPending}>
            Save Changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default EditCustomerModal;
