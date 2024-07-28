import { useState, useEffect } from "react";
import { AnalService, Sensors } from "../client";

const FILTER_OPTIONS: string[] = ["all", "NB", "SB", "EB", "WB"];
const STRING_FILTER_OPTIONS: string[] = ["all", "car", "motorcycle", "pedestrian", "bicycle"];

export function useFilter() {
    const [filter, setFilter] = useState<string>(FILTER_OPTIONS[0]);
    const [stringFilter, setStringFilter] = useState<string>(STRING_FILTER_OPTIONS[0]);
    const [sensorFilter, setSensorFilter] = useState<string>("all");
    const [sensorOptions, setSensorOptions] = useState<{ id: string, name: string }[]>([{ id: "all", name: "all" }]);

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const sensors: Sensors[] = await AnalService.getSensors();
                const sensorData = sensors.map(sensor => ({ id: sensor.id, name: sensor.name }));
                setSensorOptions(prevOptions => [...prevOptions, ...sensorData]);
            } catch (error) {
                console.error("Failed to fetch sensors", error);
            }
        };

        fetchSensors();
    }, []);

    const handleFilterChange = (selectedFilter: string) => {
        setFilter(selectedFilter);
    };

    const handleStringFilterChange = (selectedStringFilter: string) => {
        setStringFilter(selectedStringFilter);
    };

    const handleSensorFilterChange = (selectedSensorFilter: string) => {
        setSensorFilter(selectedSensorFilter);
    };

    return {
        filter,
        stringFilter,
        sensorFilter,
        handleFilterChange,
        handleStringFilterChange,
        handleSensorFilterChange,
        FILTER_OPTIONS,
        STRING_FILTER_OPTIONS,
        sensorOptions,
    };
}
