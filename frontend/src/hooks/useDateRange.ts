import { useState } from "react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface UseDateRangeReturn {
    dateRange: any;
    isDateRangePickerVisible: boolean;
    toggleDateRangePicker: () => void;
    handleDateRangeSelect: (ranges: any) => void;
}

export function useDateRange(): UseDateRangeReturn {
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [isDateRangePickerVisible, setIsDateRangePickerVisible] = useState(false);

    const toggleDateRangePicker = () => setIsDateRangePickerVisible(prev => !prev);

    const handleDateRangeSelect = (ranges: any) => {
        setDateRange([ranges.selection]);
        setIsDateRangePickerVisible(false);
    };

    return {
        dateRange,
        isDateRangePickerVisible,
        toggleDateRangePicker,
        handleDateRangeSelect
    };
}
