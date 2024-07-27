import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, Flex, Skeleton } from "@chakra-ui/react";

interface HealthTableProps {
    data: any[];
    isLoading: boolean;
}

function HealthTable({ data, isLoading }: HealthTableProps) {
    return (
        <TableContainer>
            <Table size={{ base: "sm", md: "md" }}>
                <Thead>
                    <Tr>
                        <Th>Start time</Th>
                        <Th>End time</Th>
                        <Th>Duration</Th>
                    </Tr>
                </Thead>
                {isLoading ? (
                    <Tbody>
                        {new Array(5).fill(null).map((_, index) => (
                            <Tr key={index}>
                                {new Array(3).fill(null).map((_, index) => (
                                    <Td key={index}>
                                        <Flex>
                                            <Skeleton height="20px" width="20px" />
                                        </Flex>
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                ) : (
                    <Tbody>
                        {data?.map(item => (
                            <Tr key={item.startTime}>
                                <Td>{item.startTime}</Td>
                                <Td>{item.endTime}</Td>
                                <Td>{item.duration}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                )}
            </Table>
        </TableContainer>
    );
}

export default HealthTable;
