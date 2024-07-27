import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, Spinner } from "@chakra-ui/react";

interface HealthTableProps {
    data: any[]; 
    isLoading: boolean;
}

function HealthTable({ data, isLoading }: HealthTableProps) {
    if (isLoading) {
        return <Spinner />;
    }

    return (
        <TableContainer>
            <Table size="md">
                <Thead>
                    <Tr>
                        <Th>Start Time</Th>
                        <Th>End Time</Th>
                        <Th>Status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item, index) => (
                        <Tr key={index}>
                            <Td>{item.startTime}</Td>
                            <Td>{item.endTime}</Td>
                            <Td>{item.status}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

export default HealthTable;
