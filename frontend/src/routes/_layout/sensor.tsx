import {
    Container,
    Flex,
    Heading,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react"
import { useQuery, } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { SensorService } from "../../client"

export const Route = createFileRoute("/_layout/sensor")({
    component: SensorsData,
})

function getSensorsDataQueryOptions({ start_date, end_date }: { start_date: string, end_date: string }) {
    return {
        queryFn: () =>
            SensorService.readData({ start_date: start_date, end_date: end_date }),
        queryKey: ["sensor", 0],
    }
}

function SensorTable() {
    let today = new Date();
    let todayDate = formatDate(today);
    let yesterdayDate = formatDate(new Date(today.setDate(today.getDate() - 1)));

    const {
        data: sensor,
        isPending
    } = useQuery({
        ...getSensorsDataQueryOptions({ start_date: yesterdayDate, end_date: todayDate }),
        placeholderData: (prevData) => prevData,
    })

    return (
        <>
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
                    {isPending
                        ? (
                            <Tbody>
                                {new Array(5).fill(null).map((_, index) => (
                                    <Tr key={index}>
                                        {new Array(4).fill(null).map((_, index) => (
                                            <Td key={index}>
                                                <Flex>
                                                    <Skeleton height="20px" width="20px" />
                                                </Flex>
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                            </Tbody>
                        )
                        : (
                            <Tbody>
                                {sensor?.map((item) => (
                                    <Tr>
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
                                )
                                )}
                            </Tbody>
                        )
                    }
                </Table>
            </TableContainer>
            <Flex
                gap={4}
                alignItems="center"
                mt={4}
                direction="row"
                justifyContent="flex-end"
            >
            </Flex>
        </>
    )
}

function SensorsData() {
    return (
        <Container maxW="full">
            <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
                Hourly Class Data by Approach
            </Heading>

            <SensorTable />
        </Container>
    )
}

function formatDate(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}