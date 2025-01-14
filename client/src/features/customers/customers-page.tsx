// features/customers/customers-page.tsx
import { useState } from "react";
import { Tabs, Button, Group, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CustomersSummaryTable from "./customers-summary-table";
import CustomersTable from "./customers-table";
import AddCustomerModal from "./add-customer-modal";

const CustomersPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>("summary");

  return (
    <div>
      {/* Header */}
      <Group justify="space-between">
        <Title order={1}>Customers</Title>
        <Button variant="primary" onClick={open}>
          Add New Customer
        </Button>
      </Group>

      {/* Add Customer Modal */}
      <Modal opened={opened} onClose={close} title="Add new customer" centered>
        <AddCustomerModal />
      </Modal>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
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
