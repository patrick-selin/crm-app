// features/customers/customer-detail-page.tsx
import { useState } from "react";
import { useParams } from "react-router";
import CustomerInfo from "../components/customer-info";
import CustomerOrders from "../components/customer-orders";
import EditCustomerModal from "../components/edit-customer-modal";
import DeleteCustomerModal from "../components/delete-customer-button";
import { Title, Group, Loader, Flex, Button, Divider } from "@mantine/core";

import { useCustomer, useCustomerOrders } from "../api/customers-queries";
import BackButton from "../../../components/back-button";

const CustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { data: customer, isLoading: isCustomerLoading } = useCustomer(
    customerId!
  );
  const { data: orders, isLoading: isOrdersLoading } = useCustomerOrders(
    customerId!
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (isCustomerLoading || isOrdersLoading) return <Loader />;
  if (!customer) return <p>Customer not found.</p>;

  return (
    <div>
      <BackButton />
      <Title order={1}>
        Customer Page: {customer.firstName} {customer.lastName}
      </Title>
      <Title order={4}>Customer ID: {customerId}</Title>

      <Flex gap="xl" justify="space-between" wrap="wrap" mt="md">
        <CustomerInfo customer={customer} />
        <Divider orientation="vertical" size="md" mt="xl" />
        <CustomerOrders orders={orders || []} />
      </Flex>
      <Group mt="lg">
        <Button onClick={() => setEditModalOpen(true)}>Edit</Button>
        <Button
          color="red"
          variant="outline"
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete
        </Button>
      </Group>

      <EditCustomerModal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        customer={customer}
      />
      <DeleteCustomerModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        customerId={customer.customerId}
      />
    </div>
  );
};

export default CustomerDetail;
