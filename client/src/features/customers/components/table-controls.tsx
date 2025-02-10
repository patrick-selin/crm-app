// features/customers/table-controls.tsx
import { Group, Select, TextInput } from "@mantine/core";
import { forwardRef } from "react";

const ROWS_PER_PAGE_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

interface TableControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string | null;
  onSortChange: (value: string | null) => void;
  limit: number;
  onLimitChange: (value: number) => void;
  sortOptions: { value: string; label: string }[];
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

const TableControls = forwardRef<HTMLInputElement, TableControlsProps>(
  ({ search, onSearchChange, sort, onSortChange, limit, onLimitChange, sortOptions }, ref) => {
    return (
      <Group justify="space-between" mb="md" pt="xl" pb="md">

        <TextInput
          label="Search by customer"
          placeholder="Search..."
          aria-label="Search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          ref={ref}
        />

        <Select
          label="Sort by column"
          placeholder="Choose..."
          aria-label="Sort"
          value={sort}
          onChange={onSortChange}
          data={sortOptions}
        />

        <Select
          label="Rows per page"
          placeholder="Rows per page"
          aria-label="Rows per page"
          value={limit.toString()}
          onChange={(value) => onLimitChange(Number(value))}
          data={ROWS_PER_PAGE_OPTIONS}
        />
      </Group>
    );
  }
);

export default TableControls;
