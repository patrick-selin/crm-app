import { Group, TextInput } from "@mantine/core";
import { DatePickerInput, DatesProvider, MonthPickerInput } from "@mantine/dates";

const OrderTableControls = ({ searchInput, setSearchInput, dateRange, setDateRange }) => {
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