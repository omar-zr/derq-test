import Chart from "react-apexcharts";

interface LineChartProps {
    options: any
    series: any
}

const LineChart = ({ options, series }: LineChartProps) => {
    return (
        <>
            <Chart
                options={options}
                series={series}
                type="line"
                width="500"
            />
        </>
    )
}

export default LineChart
