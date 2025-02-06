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
  page: number;
  setPage: (page: number) => void;
  total: number;
}

const OrderTableControls: React.FC<OrderTableControlsProps> = ({
  searchInput,
  setSearchInput,
  dateRange,
  setDateRange,
  page,
  setPage,
  total,
}) => {
  return (
    <Group mb="md">
      <TextInput
        placeholder="Search by customer"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
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
