import { useEffect, useState } from "react";
import { Alert, Button, Container, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getStatus } from "../../hooks/getGeneratorStatus";
import StatusIndicator from "../../components/Generator/StatusIndicator";      
import Forms from "../../components/Generator/Forms";
import Chart from "../../components/Generator/Chart";
import DataTable from "../../components/Generator/DataTable";
import useGeneratorForms from "../../components/Generator/useGeneratorForms";
import useChartData from "../../components/Generator/useChartData";
import useTableData from "../../components/Generator/useTableData";

export const Route = createFileRoute("/_layout/configuration")({
    component: Configuration,
});
function Configuration() {
    const { carForm, attributeForm, failureForm, handleSubmit, handleStop, errorMessage } = useGeneratorForms();
    const { data: generatorStatus, refetch } = useQuery(getStatus());
    const { chartData, chartOptions, fetchChartData } = useChartData();
    const { tableData, fetchTableData } = useTableData();

    const [isRunning, setIsRunning] = useState<boolean | null>(null);

    useEffect(() => {
        if (generatorStatus) {
            setIsRunning(generatorStatus.status.running);
        }
    }, [generatorStatus]);

    const handleStart = async () => {
        setIsRunning(true);
        await handleSubmit();
        refetch();
    };

    const handleStopGenerator = async () => {
        setIsRunning(false);
        await handleStop();
        refetch();
    };

    useEffect(() => {
        if (generatorStatus && !carForm.values.Car && !attributeForm.values.NB && !failureForm.values.CountsRate) {
            const config = generatorStatus.status.config;
            carForm.setValues({
                Car: config.class_prob[0].toString(),
                Motorcycle: config.class_prob[1].toString(),
                Pedestrian: config.class_prob[2].toString(),
                Bicycle: config.class_prob[3].toString(),
            });
            attributeForm.setValues({
                NB: config.approach_prob[0].toString(),
                SB: config.approach_prob[1].toString(),
                WB: config.approach_prob[2].toString(),
                EB: config.approach_prob[3].toString(),
            });
            failureForm.setValues({
                CountsRate: config.counts_rate.toString(),
                Downtime: config.downtime_prob.toString(),
            });
        }
    }, [generatorStatus, carForm, attributeForm, failureForm]);

    useEffect(() => {
        fetchChartData();
        const chartInterval = setInterval(fetchChartData, 30000);
        return () => clearInterval(chartInterval);
    }, [fetchChartData]);

    useEffect(() => {
        fetchTableData();
        const tableInterval = setInterval(fetchTableData, 30000);
        return () => clearInterval(tableInterval);
    }, [fetchTableData]);

    return (
        <Container maxW="full">
            <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
                Generator
            </Heading>
            <StatusIndicator isRunning={isRunning ?? false} />
            <Forms carForm={carForm} attributeForm={attributeForm} failureForm={failureForm} />
            {errorMessage && <Alert status="error" mt={5}>{errorMessage}</Alert>}
            {!isRunning ? (
                <Button colorScheme="blue" gap={1} fontSize={{ base: "sm", md: "inherit" }} onClick={handleStart}>
                    Run
                </Button>
            ) : (
                <Button colorScheme="red" gap={1} fontSize={{ base: "sm", md: "inherit" }} onClick={handleStopGenerator} ml={4}>
                    Stop
                </Button>
            )}
            <Chart options={chartOptions} series={chartData} type="line" width="100%" height={600} />
            <DataTable tableData={tableData} />
        </Container>
    );
}

export default Configuration;