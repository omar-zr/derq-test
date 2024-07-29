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
        type: 'category',
        labels: {
            rotate: -45,
            style: {
                colors: '#fff',
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400
            }
        },
        categories: []
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
            show: true
        }
    },
    legend: {
        position: 'bottom'
    }
};

const useChartData = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartOptions, setChartOptions] = useState<any>(CHART_OPTIONS);

    const fetchChartData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost/api/v1/sensors/data/live');
            const data = await response.json();
            const formattedData = formatLiveData(data);
            const categories = Array.from(new Set(formattedData.map((d: any) => d.time)));
            const series = mapSeriesData(data, formattedData, categories);

            setChartOptions((prevOptions: any) => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories: categories
                }
            }));
            setChartData(series);
        } catch (error) {
            console.error("Error fetching sensor data:", error);
        }
    }, []);

    const formatLiveData = (data: any) => {
        return data.flatMap((approach: any) =>
            approach.hours.map((hour: any) => ({
                time: new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                count: hour.count,
                approach: approach.approach
            }))
        );
    };

    const mapSeriesData = (data: any, formattedData: any, categories: any) => {
        return data.map((approach: any) => {
            const approachData = formattedData.filter((d: any) => d.approach === approach.approach);
            return {
                name: approach.approach,
                data: categories.map((category: string) => {
                    const dataPoint = approachData.find((d: any) => d.time === category);
                    return dataPoint ? dataPoint.count : 0;
                })
            };
        });
    };

    return { chartData, chartOptions, fetchChartData };
};

export default useChartData;