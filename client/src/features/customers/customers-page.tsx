// features/customers/customers-page.tsx
import { Tabs, Button, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CustomersSummaryTable from "./customers-summary-table";
import CustomersTable from "./customers-table";
import AddCustomerModal from "./add-customer-modal";

const CustomersPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <Group>
        <h1>Customers</h1>
        <Modal
          opened={opened}
          onClose={close}
          title="Add new customer"
          centered
        >
          <AddCustomerModal />
        </Modal>
        <Button variant="primary" onClick={open}>
          Add New Customer
        </Button>
      </Group>

      {/* <Tabs value={activeTab} onTabChange={setActiveTab}> */}
      <Tabs defaultValue="summary">
        <Tabs.List>
          <Tabs.Tab value="summary">Customer Summary</Tabs.Tab>
          <Tabs.Tab value="details">All Customers</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="summary">
          <CustomersSummaryTable />
        </Tabs.Panel>
        <Tabs.Panel value="details">
          <CustomersTable />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default CustomersPage;
