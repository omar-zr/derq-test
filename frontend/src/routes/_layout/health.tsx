import { Container, Heading, Button, Select, Flex } from "@chakra-ui/react";
import { DateRange } from "react-date-range";
import { useHealthData } from "../../hooks/useHealthData";
import HealthTable from "../../components/Health/HealthTable";
import { useDateRange } from "../../hooks/useDateRange";
import { createFileRoute } from "@tanstack/react-router";
import { useFilter } from "../../hooks/useFilter";

export const Route = createFileRoute("/_layout/health")({
    component: HealthCheck,
});

function HealthCheck() {
    const { dateRange, isDateRangePickerVisible, toggleDateRangePicker, handleDateRangeSelect } = useDateRange();
    const { filter, stringFilter, sensorFilter, handleFilterChange, handleStringFilterChange, handleSensorFilterChange, FILTER_OPTIONS, STRING_FILTER_OPTIONS, sensorOptions } = useFilter();
    const { data, isLoading } = useHealthData(dateRange[0].startDate, dateRange[0].endDate, filter, stringFilter, sensorFilter);

    return (
        <Container maxW="full">
            <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
                System Health Downtime
            </Heading>
            <Button onClick={toggleDateRangePicker}>
                {isDateRangePickerVisible ? "Hide Date Range Picker" : "Show Date Range Picker"}
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
                <Select value={sensorFilter} onChange={(e) => handleSensorFilterChange(e.target.value)}>
                    {sensorOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </Select>
            </Flex>
            <HealthTable data={data ?? []} isLoading={isLoading} />
        </Container>
    );
}

export default HealthCheck;
