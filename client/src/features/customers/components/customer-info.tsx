import { Card, Text, Title } from "@mantine/core";
import { Customer } from "../../../schemas/customer-schemas";

const CustomerInfo = ({ customer }: { customer: Customer }) => (
  <div>
    <Title order={2}>Customer info</Title>
    <Card shadow="sm" mb="md" withBorder>
      <Title order={3}>
        {customer.firstName} {customer.lastName}
      </Title>
      <Text>Email: {customer.email}</Text>
      <Text>Phone: {customer.phone}</Text>
      <Text>
        Address: {customer.address}, {customer.city}
      </Text>
      <Text>Postal Code: {customer.postalCode}</Text>
      <Text>Country: {customer.country}</Text>
    </Card>
  </div>
);

export default CustomerInfo;
