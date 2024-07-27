import { useState } from "react";

const FILTER_OPTIONS = ["NB", "SB", "EB", "WB"];
const STRING_FILTER_OPTIONS = ["car", "motorcycle", "pedestrian", "bicycle"];

export function useFilter() {
    const [filter, setFilter] = useState<string[]>(FILTER_OPTIONS);
    const [stringFilter, setStringFilter] = useState<string[]>(STRING_FILTER_OPTIONS);

    const handleFilterChange = (values: string[]) => {
        setFilter(values);
    };

    const handleStringFilterChange = (values: string[]) => {
        setStringFilter(values);
    };

    return {
        filter,
        stringFilter,
        handleFilterChange,
        handleStringFilterChange,
        FILTER_OPTIONS,
        STRING_FILTER_OPTIONS,
    };
}
