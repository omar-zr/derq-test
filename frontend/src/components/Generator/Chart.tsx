import { FC } from "react";
import ReactApexChart from "react-apexcharts";

interface ChartProps {
    options: any;
    series: any[];
    type: "area" | "line" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap";
    width: string;
    height: number;
}

const Chart: FC<ChartProps> = ({ options, series, type, width, height }) => {
    return (
        <ReactApexChart options={options} series={series} type={type} width={width} height={height} />
    );
};

export default Chart;