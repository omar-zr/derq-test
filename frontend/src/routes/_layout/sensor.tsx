import { Container, Heading, Button } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { DateRange } from "react-date-range";
import SensorTable from "../../components/Sensor/SensorTable";
import { useSensorsData } from "../../hooks/useSensorsData";
import { useDateRange } from "../../hooks/useDateRange";

export const Route = createFileRoute("/_layout/sensor")({
    component: SensorsData,
});


function SensorsData() {
    const { dateRange, isDateRangePickerVisible, toggleDateRangePicker, handleDateRangeSelect } = useDateRange();
    const { data, isLoading } = useSensorsData(dateRange[0].startDate, dateRange[0].endDate);

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
            <SensorTable data={data} isLoading={isLoading} />
        </Container>
    );
}

export default SensorsData;
