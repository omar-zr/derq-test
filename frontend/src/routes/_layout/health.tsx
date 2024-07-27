
import { Container, Heading, Button } from "@chakra-ui/react";
import { DateRange } from "react-date-range";
import { useHealthData } from "../../hooks/useHealthData";
import HealthTable from "../../components/Health/HealthTable";
import { useDateRange } from "../../hooks/useDateRange";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/health")({
    component: HealthCheck,
});

function HealthCheck() {
    const { dateRange, isDateRangePickerVisible, toggleDateRangePicker, handleDateRangeSelect } = useDateRange();
    const { data, isLoading } = useHealthData(dateRange[0].startDate, dateRange[0].endDate);

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
            <HealthTable data={data} isLoading={isLoading} />
        </Container>
    );
}

export default HealthCheck;
