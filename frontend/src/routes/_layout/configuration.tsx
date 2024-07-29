import { useEffect, useState } from "react";
import { Button, Container, Heading, Alert } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useGenerator } from "../../hooks/useGenerator";
import { getStatus } from "../../hooks/getGeneratorStatus";
import { GeneratorConfig, GeneratorService } from "../../client";
import StatusIndicator from "../../components/Generator/StatusIndicator";
import Forms from "../../components/Generator/Forms";
import Chart from "react-apexcharts";

export const Route = createFileRoute("/_layout/configuration")({
    component: Configuration,
});

function Configuration() {
    const carForm = useGenerator({
        Car: "",
        Motorcycle: "",
        Pedestrian: "",
        Bicycle: "",
    });

    const attributeForm = useGenerator({
        NB: "",
        SB: "",
        WB: "",
        EB: "",
    });

    const failureForm = useGenerator({
        CountsRate: "",
        Downtime: "",
    });

    const { data: generatorStatus, refetch } = useQuery(getStatus());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartOptions, setChartOptions] = useState<any>({
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
            type: 'category',  // Set the x-axis to treat the values as categories
            labels: {
                rotate: -45,
                style: {
                    colors: '#fff',  // Adjust color if needed
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
    });

    const validateForms = () => {
        const isCarFormValid = carForm.validate();
        const isAttributeFormValid = attributeForm.validate();
        const isFailureFormValid = failureForm.validate();

        const carFormSum = Object.values(carForm.values).reduce((acc, curr) => acc + parseFloat(curr || "0"), 0);
        const attributeFormSum = Object.values(attributeForm.values).reduce((acc, curr) => acc + parseFloat(curr || "0"), 0);

        if (carFormSum !== 1) {
            setErrorMessage("The sum of all car form values must be 1.");
            return false;
        }

        if (attributeFormSum !== 1) {
            setErrorMessage("The sum of all attribute form values must be 1.");
            return false;
        }

        return isCarFormValid && isAttributeFormValid && isFailureFormValid;
    };

    const handleSubmit = async () => {
        if (validateForms()) {
            const config: GeneratorConfig = {
                counts_rate: parseFloat(failureForm.values.CountsRate),
                approach_prob: [
                    parseFloat(attributeForm.values.NB),
                    parseFloat(attributeForm.values.SB),
                    parseFloat(attributeForm.values.WB),
                    parseFloat(attributeForm.values.EB),
                ],
                class_prob: [
                    parseFloat(carForm.values.Car),
                    parseFloat(carForm.values.Motorcycle),
                    parseFloat(carForm.values.Pedestrian),
                    parseFloat(carForm.values.Bicycle),
                ],
                downtime_prob: parseFloat(failureForm.values.Downtime),
            };
            try {
                await GeneratorService.configureGenerator(config);
                await GeneratorService.startGenerator();
                refetch();
            } catch (error) {
                setErrorMessage("Failed to start generator");
            }
        }
    };

    const handleStop = async () => {
        try {
            await GeneratorService.stopGenerator();
            refetch();
        } catch (error) {
            setErrorMessage("Failed to stop generator");
        }
    };

    useEffect(() => {
        if (generatorStatus && !carForm.values.Car && !attributeForm.values.NB && !failureForm.values.CountsRate) {
            const config = generatorStatus.status.config as GeneratorConfig;

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
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost/api/v1/sensors/data/live');
                const data = await response.json();
    
                // Format the data correctly
                const formattedData = data.flatMap((approach: any) =>
                    approach.hours.map((hour: any) => ({
                        time: new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        count: hour.count,
                        approach: approach.approach
                    }))
                );
    
                // Get unique times for categories
                const categories = Array.from(new Set(formattedData.map((d: any) => d.time)));
    
                // Map series data to these categories
                const series = data.map((approach: any) => {
                    const approachData = formattedData.filter((d: any) => d.approach === approach.approach);
    
                    return {
                        name: approach.approach,
                        data: categories.map((category: string) => {
                            const dataPoint = approachData.find((d: any) => d.time === category);
                            return dataPoint ? dataPoint.count : 0; // Default to 0 if no data point for this time
                        })
                    };
                });
    
                // Update chart options and data
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
        };
    
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);
    
    

    return (
        <Container maxW="full">
            <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
                Generator
            </Heading>
            <StatusIndicator isRunning={generatorStatus?.status.running ?? false} />
            <Forms carForm={carForm} attributeForm={attributeForm} failureForm={failureForm} />
            {errorMessage && <Alert status="error" mt={5}>{errorMessage}</Alert>}
            {!generatorStatus?.status.running && (
                <Button colorScheme="blue" gap={1} fontSize={{ base: "sm", md: "inherit" }} onClick={handleSubmit}>
                    Run
                </Button>
            )}
            {generatorStatus?.status.running && (
                <Button colorScheme="red" gap={1} fontSize={{ base: "sm", md: "inherit" }} onClick={handleStop} ml={4}>
                    Stop
                </Button>
            )}
            <Chart options={chartOptions} series={chartData} type="line" width="100%" height={600} />
        </Container>
    );
}

export default Configuration;