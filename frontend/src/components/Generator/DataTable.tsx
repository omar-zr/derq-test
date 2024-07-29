import { FC } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

interface DataTableProps {
    tableData: any[];
}

const DataTable: FC<DataTableProps> = ({ tableData }) => {
    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>Minute</Th>
                    <Th>Total Count</Th>
                    <Th>NB Car</Th>
                    <Th>NB Motorcycle</Th>
                    <Th>NB Pedestrian</Th>
                    <Th>NB Bicycle</Th>
                    <Th>NB Mobility Aid</Th>
                    <Th>SB Car</Th>
                    <Th>SB Motorcycle</Th>
                    <Th>SB Pedestrian</Th>
                    <Th>SB Bicycle</Th>
                    <Th>SB Mobility Aid</Th>
                    <Th>WB Car</Th>
                    <Th>WB Motorcycle</Th>
                    <Th>WB Pedestrian</Th>
                    <Th>WB Bicycle</Th>
                    <Th>WB Mobility Aid</Th>
                    <Th>EB Car</Th>
                    <Th>EB Motorcycle</Th>
                    <Th>EB Pedestrian</Th>
                    <Th>EB Bicycle</Th>
                    <Th>EB Mobility Aid</Th>
                </Tr>
            </Thead>
            <Tbody>
                {tableData.map((entry, index) => (
                    <Tr key={index}>
                        <Td>{new Date(entry.minute).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Td>
                        <Td>{entry.totalCount}</Td>
                        <Td>{entry.results.NB_car}</Td>
                        <Td>{entry.results.NB_motorcycle}</Td>
                        <Td>{entry.results.NB_pedestrian}</Td>
                        <Td>{entry.results.NB_bicycle}</Td>
                        <Td>{entry.results.NB_mobility_aid}</Td>
                        <Td>{entry.results.SB_car}</Td>
                        <Td>{entry.results.SB_motorcycle}</Td>
                        <Td>{entry.results.SB_pedestrian}</Td>
                        <Td>{entry.results.SB_bicycle}</Td>
                        <Td>{entry.results.SB_mobility_aid}</Td>
                        <Td>{entry.results.WB_car}</Td>
                        <Td>{entry.results.WB_motorcycle}</Td>
                        <Td>{entry.results.WB_pedestrian}</Td>
                        <Td>{entry.results.WB_bicycle}</Td>
                        <Td>{entry.results.WB_mobility_aid}</Td>
                        <Td>{entry.results.EB_car}</Td>
                        <Td>{entry.results.EB_motorcycle}</Td>
                        <Td>{entry.results.EB_pedestrian}</Td>
                        <Td>{entry.results.EB_bicycle}</Td>
                        <Td>{entry.results.EB_mobility_aid}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default DataTable;