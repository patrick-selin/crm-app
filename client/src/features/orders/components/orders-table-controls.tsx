import { Group, TextInput } from "@mantine/core";
import {
  DatePickerInput,
  DatesProvider,
  MonthPickerInput,
} from "@mantine/dates";
import { forwardRef } from "react";

interface OrderTableControlsProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  dateRange: [Date | null, Date | null];
  setDateRange: (value: [Date | null, Date | null]) => void;
}

const OrderTableControls = forwardRef<
  HTMLInputElement,
  OrderTableControlsProps
>(({ searchInput, setSearchInput, dateRange, setDateRange }, ref) => {
  return (
    <Group mb="md" pt="xl" pb="md">
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
          label="Pick date"
          placeholder="Select date range"
          type="range"
          value={dateRange}
          onChange={setDateRange}
        />
      </DatesProvider>
    </Group>
  );
});

export default OrderTableControls;
