// features/customers/table-controls.tsx
import { Group, Select, TextInput } from "@mantine/core";

interface TableControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  limit: number;
  onLimitChange: (value: number) => void;
  sortOptions: { value: string; label: string }[];
}

const TableControls = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  limit,
  onLimitChange,
  sortOptions,
}: TableControlsProps) => {
  return (
    <Group justify="space-between" mb="md" pt={"xl"} pb={"md"}>
      {/* Search Input */}

      <TextInput
        placeholder="Search..."
        aria-label="Search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      {/* Sort Options */}
      <Select
        placeholder="Sort by"
        aria-label="Sort"
        value={sort}
        onChange={onSortChange}
        data={sortOptions}
      />

      {/* Limit Options */}
      <Select
        placeholder="Rows per page"
        aria-label="Rows per page"
        value={limit.toString()}
        onChange={(value) => onLimitChange(Number(value))}
        data={[
          { value: "5", label: "5" },
          { value: "10", label: "10" },
          { value: "25", label: "25" },
          { value: "50", label: "50" },
        ]}
      />
    </Group>
  );
};

export default TableControls;
