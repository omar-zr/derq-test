import { Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Chart from "react-apexcharts";
import { AnalService } from "../../client";
import { formatDate } from "../../utils";

interface LineChartProps {
    startDate: Date;
    endDate: Date;
    filter: string[];
}

function getDataQueryOptions(startDate: Date, endDate: Date, filter: string[]) {
    return {
        queryFn: () =>
            AnalService.readData({
                start_date: formatDate(startDate),
                end_date: formatDate(endDate)
            }),
        queryKey: ["chart", startDate, endDate, ...filter],
    };
}

function LineChart({ startDate, endDate, filter }: LineChartProps) {
    const { data } = useQuery(getDataQueryOptions(startDate, endDate, filter));

    const state = {
        options: {
            chart: {
                id: 'counts per approach',
            },
            xaxis: {
                categories: data?.[0]?.hours.map(item => item.time) || [],
            },
        },
        series: [
            ...(data || []).filter(dataSet => filter.includes(dataSet?.approach)).map((dataSet) => ({
                name: dataSet?.approach,
                data: dataSet?.hours.map(item => item.count) || [],
            })),
        ],
    };

    return (
        <Box>
            <Chart
                options={state.options}
                series={state.series}
                type="line"
                width="100%"
                height="400"
            />
        </Box>
    );
}

export default LineChart;
