import { Container, Heading, Button, Select, Flex } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { DateRange } from "react-date-range";
import SensorTable from "../../components/Sensor/SensorTable";
import { useSensorsData } from "../../hooks/useSensorsData";
import { useDateRange } from "../../hooks/useDateRange";
import { useFilter } from "../../hooks/useFilter";

export const Route = createFileRoute("/_layout/sensor")({
    component: SensorsData,
});

function SensorsData() {
    const { dateRange, isDateRangePickerVisible, toggleDateRangePicker, handleDateRangeSelect } = useDateRange();
    const { filter, stringFilter, sensorFilter, handleFilterChange, handleStringFilterChange, handleSensorFilterChange, FILTER_OPTIONS, STRING_FILTER_OPTIONS, sensorOptions } = useFilter();
    const { data, isLoading } = useSensorsData(dateRange[0].startDate, dateRange[0].endDate, filter, stringFilter, sensorFilter);

    return (
        <Container maxW="full">
            <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
                Hourly Class Data by Approach
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
                    {sensorOptions.map((sensor) => (
                        <option key={sensor.id} value={sensor.id}>
                            {sensor.name}
                        </option>
                    ))}
                </Select>
            </Flex>
            <SensorTable data={data ?? []} isLoading={isLoading} />
        </Container>
    );
}

export default SensorsData;
