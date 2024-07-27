import { useQuery } from "@tanstack/react-query";
import { SensorService } from "../client";
import { formatDate } from "../utils";

export function useSensorsData(startDate: Date, endDate: Date, filter: string, stringFilter: string) {
    return useQuery({
        queryFn: () =>
            SensorService.readData({
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                approach: filter,
                type: stringFilter,
            }),
        queryKey: ["sensor", startDate, endDate, filter, stringFilter],
    });
}
