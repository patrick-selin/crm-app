// features/orders/orders-page.tsx
import { useState } from "react";
import { Tabs, Group, Title } from "@mantine/core";
import OrdersTable from "../components/orders-table";
import OrdersSummary from "../components/orders-summary";

const OrdersPage = () => {

  const [activeTab, setActiveTab] = useState<string | null>("all");

  return (
    <div>
      <Group justify="space-between">
        <Title order={1}>Orders</Title>
      </Group>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="all">All Orders</Tabs.Tab>
          <Tabs.Tab value="summary">Orders Summary</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="all">
          <OrdersTable />
        </Tabs.Panel>
        <Tabs.Panel value="summary">
          <OrdersSummary />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
