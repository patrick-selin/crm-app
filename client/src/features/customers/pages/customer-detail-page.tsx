// features/customers/customer-detail.tsx
import { useParams, useNavigate } from "react-router";
import CustomerInfo from "../components/customer-info";
import CustomerOrders from "../components/customer-orders";
import EditCustomerModal from "../components/edit-customer-modal";
import DeleteCustomerButton from "../components/delete-customer-button";
import { Title, Group, Loader, Flex, Button } from "@mantine/core";

import { useCustomer, useCustomerOrders } from "../api/customers-queries";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading: isCustomerLoading } = useCustomer(id!);
  const { data: orders, isLoading: isOrdersLoading } = useCustomerOrders(id!);

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
      <Group>
        <EditCustomerModal />
        <DeleteCustomerButton />
      </Group>
    </div>
  );
};

export default CustomerDetail;
