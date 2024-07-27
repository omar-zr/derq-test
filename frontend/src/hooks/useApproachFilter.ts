import { useState } from "react";

const FILTER_OPTIONS: string[] = ["all", "NB", "SB", "EB", "WB"];
const STRING_FILTER_OPTIONS: string[] = ["all", "car", "motorcycle", "pedestrian", "bicycle"];

export function useFilter() {
    const [filter, setFilter] = useState<string>(FILTER_OPTIONS[0]);
    const [stringFilter, setStringFilter] = useState<string>(STRING_FILTER_OPTIONS[0]);

    const handleFilterChange = (selectedFilter: string) => {
        setFilter(selectedFilter);
    };

    const handleStringFilterChange = (selectedStringFilter: string) => {
        setStringFilter(selectedStringFilter);
    };

    return {
        filter,
        stringFilter,
        handleFilterChange,
        handleStringFilterChange,
        FILTER_OPTIONS,
        STRING_FILTER_OPTIONS
    };
}
