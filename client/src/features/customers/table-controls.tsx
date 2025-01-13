// features/customers/table-controls.tsx
import { Group, Select, Input, Pagination } from "@mantine/core";

const TableControls = () => {
  return (
    <Group justify="space-between" mb="md">
      <Input placeholder="Input component" />
      <Select
        placeholder="Sort By"
        data={[
          { value: "firstName:asc", label: "Name (A-Z)" },
          { value: "firstName:desc", label: "Name (Z-A)" },
          { value: "totalSpent:asc", label: "Total Spent (Low to High)" },
          { value: "totalSpent:desc", label: "Total Spent (High to Low)" },
        ]}
      />
      <Pagination total={10} />
    </Group>
  );
};

export default TableControls;
