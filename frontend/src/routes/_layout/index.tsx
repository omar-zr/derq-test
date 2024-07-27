import { Container, Box, Text, Button, CheckboxGroup, Checkbox, Flex } from "@chakra-ui/react";
import { DateRange } from "react-date-range";
import useAuth from "../../hooks/useAuth";
import { createFileRoute } from "@tanstack/react-router";
import { useDateRange } from "../../hooks/useDateRange";
import { useFilter } from "../../hooks/useApproachFilter";
import LineChart from "../../components/Index/LineChart";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const { user: currentUser } = useAuth();
  const { dateRange, isDateRangePickerVisible, toggleDateRangePicker, handleDateRangeSelect } = useDateRange();
  const { filter, stringFilter, handleFilterChange, handleStringFilterChange, FILTER_OPTIONS, STRING_FILTER_OPTIONS } = useFilter();

  return (
    <Container maxW="full">
      <Box pt={12} m={4}>
        <Text fontSize="2xl">Hi, {currentUser?.full_name || currentUser?.email} 👋🏼</Text>
        <Text>Welcome back, nice to see you again!</Text>
      </Box>
      <Button onClick={toggleDateRangePicker}>
        {isDateRangePickerVisible ? "Hide Date Range Picker" : "Show Date Range Picker"}
      </Button>
      {isDateRangePickerVisible && (
        <DateRange
          ranges={dateRange}
          onChange={handleDateRangeSelect}
        />
      )}
      <Flex mt={4} wrap="wrap" gap={4}>
        <Box>
          <Text mb={2}>Approach Filter</Text>
          <CheckboxGroup value={filter} onChange={handleFilterChange}>
            {FILTER_OPTIONS.map(option => (
              <Checkbox key={option} value={option}>
                {option}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Box>
        <Box>
          <Text mb={2}>Type Filter</Text>
          <CheckboxGroup value={stringFilter} onChange={handleStringFilterChange}>
            {STRING_FILTER_OPTIONS.map(option => (
              <Checkbox key={option} value={option}>
                {option}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Box>
      </Flex>
      <Box style={{ width: '100%' }}>
        <LineChart
          startDate={dateRange[0].startDate}
          endDate={dateRange[0].endDate}
          filter={filter}
        />
      </Box>
    </Container>
  );
}

export default Dashboard;

