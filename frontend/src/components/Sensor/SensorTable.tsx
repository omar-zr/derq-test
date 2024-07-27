import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, Flex, Skeleton } from "@chakra-ui/react";

interface SensorTableProps {
    data: any[];
    isLoading: boolean;
}

function SensorTable({ data, isLoading }: SensorTableProps) {
    return (
        <TableContainer>
            <Table size={{ base: "sm", md: "md" }}>
                <Thead>
                    <Tr>
                        <Th>Hour</Th>
                        <Th>NB_car</Th>
                        <Th>NB_motorcycle</Th>
                        <Th>NB_pedestrian</Th>
                        <Th>NB_bicycle</Th>
                        <Th>SB_car</Th>
                        <Th>SB_motorcycle</Th>
                        <Th>SB_pedestrian</Th>
                        <Th>SB_bicycle</Th>
                        <Th>WB_car</Th>
                        <Th>WB_motorcycle</Th>
                        <Th>WB_pedestrian</Th>
                        <Th>WB_bicycle</Th>
                        <Th>EB_car</Th>
                        <Th>EB_motorcycle</Th>
                        <Th>EB_pedestrian</Th>
                        <Th>EB_bicycle</Th>
                        <Th>Total</Th>
                    </Tr>
                </Thead>
                {isLoading ? (
                    <Tbody>
                        {new Array(5).fill(null).map((_, index) => (
                            <Tr key={index}>
                                {new Array(16).fill(null).map((_, index) => (
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
                        {data.map(item => (
                            <Tr key={item.hour}>
                                <Td>{item.hour}</Td>
                                <Td>{item.results['NB_car']}</Td>
                                <Td>{item.results['NB_motorcycle']}</Td>
                                <Td>{item.results['NB_pedestrian']}</Td>
                                <Td>{item.results['NB_bicycle']}</Td>
                                <Td>{item.results['SB_car']}</Td>
                                <Td>{item.results['SB_motorcycle']}</Td>
                                <Td>{item.results['SB_pedestrian']}</Td>
                                <Td>{item.results['SB_bicycle']}</Td>
                                <Td>{item.results['WB_car']}</Td>
                                <Td>{item.results['WB_motorcycle']}</Td>
                                <Td>{item.results['WB_pedestrian']}</Td>
                                <Td>{item.results['WB_bicycle']}</Td>
                                <Td>{item.results['EB_car']}</Td>
                                <Td>{item.results['EB_motorcycle']}</Td>
                                <Td>{item.results['EB_pedestrian']}</Td>
                                <Td>{item.results['EB_bicycle']}</Td>
                                <Td>{item.totalCount}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                )}
            </Table>
        </TableContainer>
    );
}

export default SensorTable;
