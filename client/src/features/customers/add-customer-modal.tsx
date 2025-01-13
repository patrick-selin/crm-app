// features/customers/add-customer-modal.tsx
import { Button, TextInput, Group } from "@mantine/core";

const AddCustomerModal = () => {

  return (
    <>
      <form>
        <TextInput label="First Name" placeholder="First Name" />
        <TextInput label="Last Name" placeholder="Last Name" />

        <Group mt="md">
          <Button type="submit">Add</Button>
        </Group>
      </form>
    </>
  );
};

export default AddCustomerModal;
