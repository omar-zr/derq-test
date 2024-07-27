import { useQuery } from "@tanstack/react-query";
import { HealthService } from "../client";
import { formatDate } from "../utils";

export function useHealthData(startDate: Date, endDate: Date, filter: string, stringFilter: string, sensorFilter: string) {
    return useQuery({
        queryFn: () =>
            HealthService.readData({
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                approach: filter,
                type: stringFilter,
                sensor_id: sensorFilter
            }),
        queryKey: ["health", startDate, endDate, filter, stringFilter],
    });
}
