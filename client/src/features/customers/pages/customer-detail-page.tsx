// features/customers/customer-detail.tsx

import CustomerInfo from "../components/customer-info";
import CustomerOrders from "../components/customer-orders";
import EditCustomerModal from "../compnents/edit-customer-modal";
import DeleteCustomerButton from "../compnents/delete-customer-button";
import { Title } from "@mantine/core";

const CustomerDetail = () => {
  return (
    <div>
      {/* muista back-button */}
      <Title order={1}>Customer Page</Title>
      <CustomerInfo />
      <CustomerOrders />
    </div>
  );
};

export default CustomerDetail;
