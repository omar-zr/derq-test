import { useState, useCallback } from "react";

const useTableData = () => {
    const [tableData, setTableData] = useState<any[]>([]);

    const fetchTableData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost/api/v1/sensors/data/live/detailed_counts');
            const data = await response.json();
            setTableData(data);
        } catch (error) {
            console.error("Error fetching detailed counts data:", error);
        }
    }, []);

    return { tableData, fetchTableData };
};

export default useTableData;