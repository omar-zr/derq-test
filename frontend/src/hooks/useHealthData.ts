import { useQuery } from "@tanstack/react-query";
import { HealthService } from "../client/services";

interface UseHealthDataReturn {
    data: any;
    isLoading: boolean;
}

export function useHealthData(startDate: Date, endDate: Date): UseHealthDataReturn {
    const { data, isLoading } = useQuery({
        queryFn: () => HealthService.readData({
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
        }),
        queryKey: ["health", startDate, endDate],
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
