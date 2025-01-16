// features/customers/customer-detail-page.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import CustomerInfo from "../components/customer-info";
import CustomerOrders from "../components/customer-orders";
import EditCustomerModal from "../components/edit-customer-modal";
import DeleteCustomerModal from "../components/delete-customer-button";
import { Title, Group, Loader, Flex, Button } from "@mantine/core";

import { useCustomer, useCustomerOrders } from "../api/customers-queries";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading: isCustomerLoading } = useCustomer(id!);
  const { data: orders, isLoading: isOrdersLoading } = useCustomerOrders(id!);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (isCustomerLoading || isOrdersLoading) return <Loader />;
  if (!customer) return <p>Customer not found.</p>;

  return (
    <div>
      <Button mt="sm" variant="light" onClick={() => navigate(-1)}>
        Back
      </Button>
      <Title order={1}>
        Customer Page: {customer.firstName} {customer.lastName}
      </Title>
      <Title order={4}>Customer ID: {id}</Title>

      <Flex gap="xl" justify="space-between" wrap="wrap" mt="xl">
        <CustomerInfo customer={customer} />
        <CustomerOrders customerId={id!} orders={orders || []} />
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
