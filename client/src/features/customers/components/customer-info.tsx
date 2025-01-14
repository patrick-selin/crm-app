import { Card, Text } from "@mantine/core";
import { Customer } from "../../../schemas/customer-schemas";

const CustomerInfo = ({ customer }: { customer: Customer }) => (
  <Card shadow="sm" mb="md">
    <Text>Email: {customer.email}</Text>
    <Text>Phone: {customer.phone}</Text>
    <Text>
      Address: {customer.address}, {customer.city}
    </Text>
    <Text>Postal Code: {customer.postalCode}</Text>
    <Text>Country: {customer.country}</Text>
  </Card>
);

export default CustomerInfo;
