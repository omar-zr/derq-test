import { useQuery } from "@tanstack/react-query";
import { SensorService } from "../client/services";

interface UseSensorsDataReturn {
    data: any[];
    isLoading: boolean;
}

export function useSensorsData(startDate: Date, endDate: Date): UseSensorsDataReturn {
    const { data, isLoading } = useQuery({
        queryFn: () =>
            SensorService.readData({
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
            }),
        queryKey: ["sensor", startDate, endDate],
        placeholderData: (prevData) => prevData,
    });

    return { data, isLoading };
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
