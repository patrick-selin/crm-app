import { Card, Text, Title, } from "@mantine/core";
import { Customer } from "../../../schemas/customer-schemas";

const CustomerInfo = ({ customer }: { customer: Customer }) => (
  <div>
    <Title order={2}>Customer info</Title>
    <Card shadow="sm" mb="md" withBorder>
      <Title order={3}>
        {customer.firstName} {customer.lastName}
      </Title>
      <Text mb="sm">Email: {customer.email}</Text>
      <Text mb="sm">Phone: {customer.phone}</Text>
      <Text mb="sm">
        Address: {customer.address}, {customer.city}
      </Text>
      <Text mb="sm">Postal Code: {customer.postalCode}</Text>
      <Text mb="sm">Country: {customer.country}</Text>
    </Card>
  </div>
);

export default CustomerInfo;
