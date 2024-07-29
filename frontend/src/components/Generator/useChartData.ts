import { useState, useCallback } from "react";

const CHART_OPTIONS = {
    chart: {
        id: "sensor-data",
        zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: false,
            zoomedArea: {
                fill: {
                    color: '#90CAF9',
                    opacity: 0.4
                },
                stroke: {
                    color: '#0D47A1',
                    opacity: 0.4,
                    width: 1
                }
            }
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            rotate: -45,
            formatter: function (value: any) {
                return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            },
            style: {
                colors: '#fff',
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400
            }
        }
    },
    yaxis: {
        title: {
            text: 'Count'
        }
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    tooltip: {
        shared: true,
        intersect: false,
        x: {
            show: true,
            formatter: function (value: any) {
                return new Date(value).toLocaleString();
            }
        }
    },
    legend: {
        position: 'bottom'
    }
};

const useChartData = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartOptions] = useState<any>(CHART_OPTIONS);

    const fetchChartData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost/api/v1/sensors/data/live');
            const data = await response.json();

            const formattedData = formatLiveData(data);

            const series = mapSeriesData(formattedData);

            setChartData(series);
        } catch (error) {
            console.error("Error fetching sensor data:", error);
        }
    }, []);

    const formatLiveData = (data: any) => {
        return data.flatMap((approach: any) =>
            approach.hours.map((hour: any) => ({
                time: new Date(hour.time).getTime(),
                count: hour.count,
                approach: approach.approach
            }))
        ).filter((d: any) => d.count !== 0); // Filter out zero count values
    };

    const mapSeriesData = (formattedData: any) => {
        const series: any = {};
        formattedData.forEach((d: any) => {
            if (!series[d.approach]) {
                series[d.approach] = [];
            }
            series[d.approach].push([d.time, d.count]);
        });
        return Object.keys(series).map((approach: string) => ({
            name: approach,
            data: series[approach]
        }));
    };

    return { chartData, chartOptions, fetchChartData };
};

export default useChartData;