import { Group, TextInput } from "@mantine/core";
import {
  DatePickerInput,
  DatesProvider,
  MonthPickerInput,
} from "@mantine/dates";

interface OrderTableControlsProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  dateRange: [Date | null, Date | null];
  setDateRange: (value: [Date | null, Date | null]) => void;
}

const OrderTableControls: React.FC<OrderTableControlsProps> = ({
  searchInput,
  setSearchInput,
  dateRange,
  setDateRange,
}) => {
  return (
    <Group mb="md">
      {/* Search Input */}
      <TextInput
        placeholder="Search by customer"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {/* Date Pickers */}
      <DatesProvider settings={{ consistentWeeks: true }}>
        <MonthPickerInput label="Pick month" placeholder="Pick month" type="range" />
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
};

export default OrderTableControls;
