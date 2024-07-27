import { Container, Box, Text, Button, Select, Flex } from "@chakra-ui/react";
import { DateRange } from "react-date-range";
import useAuth from "../../hooks/useAuth";
import LineChart from "../../components/Index/LineChart";
import { useDateRange } from "../../hooks/useDateRange";
import { createFileRoute } from "@tanstack/react-router";
import { useFilter } from "../../hooks/useApproachFilter";

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
        Date
      </Button>
      {isDateRangePickerVisible && (
        <DateRange
          ranges={dateRange}
          onChange={handleDateRangeSelect}
        />
      )}
      <Flex mt={4} gap={4}>
        <Select value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
          {FILTER_OPTIONS.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Select value={stringFilter} onChange={(e) => handleStringFilterChange(e.target.value)}>
          {STRING_FILTER_OPTIONS.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Flex>
      <Box style={{ width: '100%' }} mt={4}>
        <LineChart
          startDate={dateRange[0].startDate}
          endDate={dateRange[0].endDate}
          filter={filter}
          stringFilter={stringFilter}
        />
      </Box>
    </Container>
  );
}

export default Dashboard;
