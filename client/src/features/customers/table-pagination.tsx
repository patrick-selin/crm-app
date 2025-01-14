// features/customers/table-pagination.tsx
import { Group, Pagination as MantinePagination } from "@mantine/core";

interface PaginationProps {
  total: number;
  value: number; 
  onChange: (page: number) => void; 
}

const TablePagination = ({ total, value, onChange }: PaginationProps) => {
  return (
    <Group justify="center" mt="md" mb="md">
      <MantinePagination
        total={total}
        value={value}
        onChange={onChange}
      />
    </Group>
  );
};

export default TablePagination;
