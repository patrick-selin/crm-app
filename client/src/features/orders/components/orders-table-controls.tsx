import { Group, Select, TextInput } from "@mantine/core";
import {
  DatePickerInput,
  DatesProvider,
  MonthPickerInput,
} from "@mantine/dates";
import { forwardRef } from "react";

const ROWS_PER_PAGE_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

interface OrderTableControlsProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  dateRange: [Date | null, Date | null];
  setDateRange: (value: [Date | null, Date | null]) => void;
  limit: number;
  onLimitChange: (value: number) => void;
}

const OrderTableControls = forwardRef<HTMLInputElement, OrderTableControlsProps>(
  (
    { searchInput, setSearchInput, dateRange, setDateRange, limit, onLimitChange },
    ref
  ) => {
    return (
      <Group mb="md" pt="xl" pb="md" justify="space-between">

        <Group>
          <TextInput
            label="Search by customer"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            ref={ref}
          />

          <DatesProvider settings={{ consistentWeeks: true }}>
            <MonthPickerInput
              label="Pick month"
              placeholder="Pick month"
              type="range"
            />
            <DatePickerInput
              label="Pick date range"
              placeholder="Select date range"
              type="range"
              value={dateRange}
              onChange={setDateRange}
            />
          </DatesProvider>
        </Group>

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

export default OrderTableControls;
