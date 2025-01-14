// features/customers/customer-detail.tsx
import { useParams } from "react-router";
import CustomerInfo from "../components/customer-info";
import CustomerOrders from "../components/customer-orders";
import EditCustomerModal from "../components/edit-customer-modal";
import DeleteCustomerButton from "../components/delete-customer-button";
import { Title, Group, Loader } from "@mantine/core";

import { useCustomer, useCustomerOrders } from "../api/customers-queries";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: customer, isLoading: isCustomerLoading } = useCustomer(id!);
  const { data: orders, isLoading: isOrdersLoading } = useCustomerOrders(id!);


  if (isCustomerLoading || isOrdersLoading) return <Loader />;
  if (!customer) return <p>Customer not found.</p>;


  return (
    <div>
      {/* muista back-button */}
      <Title order={1}>Customer Page {id}</Title>
      <Title order={2}>{customer.firstName} {customer.lastName}</Title>
      <CustomerInfo customer={customer} />
      <CustomerOrders orders={orders || []} />
      <Group>
        <EditCustomerModal />
        <DeleteCustomerButton />
      </Group>
    </div>
  );
};

export default CustomerDetail;
