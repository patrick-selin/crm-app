// features/customers/customers-page.tsx
import { useState } from "react";
import { Tabs, Button, Group, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CustomersSummaryTable from "../components/customers-summary-table";
import CustomersTable from "../components/customers-table";
import AddCustomerModal from "../modals/add-customer-modal";

const CustomersPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>("summary");

  return (
    <div>
      <Group justify="space-between">
        <Title order={1}>Customers</Title>
        <Button variant="primary" onClick={open}>
          Add New Customer
        </Button>
      </Group>

      {/* Add Customer Modal */}
      <Modal opened={opened} onClose={close} title="Add new customer" centered>
        <AddCustomerModal opened={opened} onClose={close} />
      </Modal>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="summary">Overview</Tabs.Tab>
          <Tabs.Tab value="details">Customer Directory</Tabs.Tab>
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
