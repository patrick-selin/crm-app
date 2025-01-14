// features/customers/customer-detail.tsx
import { useParams } from "react-router";
import { useCustomer, useCustomerOrders } from "./customers-queries";
import { Loader, Title, Group, Button } from "@mantine/core";
import CustomerInfo from "./CustomerInfo";
import CustomerOrders from "./CustomerOrders";
import EditCustomerModal from "./EditCustomerModal";
import DeleteCustomerButton from "./DeleteCustomerButton";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: customer, isLoading: isCustomerLoading } = useCustomer(id!);
  const { data: orders, isLoading: isOrdersLoading } = useCustomerOrders(id!);

  if (isCustomerLoading || isOrdersLoading) return <Loader />;
  if (!customer) return <p>Customer not found</p>;

  return (
    <div>
      <Group position="apart" mb="md">
        <Title order={2}>
          {customer.firstName} {customer.lastName}
        </Title>
        <Group>
          <EditCustomerModal customer={customer} />
          <DeleteCustomerButton customerId={customer.customerId} />
        </Group>
      </Group>
      <CustomerInfo customer={customer} />
      <CustomerOrders orders={orders} />
    </div>
  );
};

export default CustomerDetail;
