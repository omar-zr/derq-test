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

import { HealthService } from "../../client/services"

export const Route = createFileRoute("/_layout/health")({
    component: HealthCheck,
})

function getHealthQueryOptions() {
    return {
        queryFn: () =>
            HealthService.readData(),
        queryKey: ["health", 0],
    }
}

function HealthTable() {
    const {
        data: health,
        isPending
    } = useQuery({
        ...getHealthQueryOptions(),
        placeholderData: (prevData) => prevData,
    })

    return (
        <>
            <TableContainer>
                <Table size={{ base: "sm", md: "md" }}>
                    <Thead>
                        <Tr>
                            <Th>Start time</Th>
                            <Th>End time</Th>
                            <Th>Duration</Th>
                        </Tr>
                    </Thead>
                    {isPending ? (
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
                    ) : (
                        <Tbody>
                            {health?.map((item) => (
                                <Tr>
                                    <Td>{item.startTime}</Td>
                                    <Td>{item.endTime}</Td>
                                    <Td>{item.duration}</Td>
                                </Tr>
                            )
                            )}
                        </Tbody>
                    )}
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

function HealthCheck() {
    return (
        <Container maxW="full">
            <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
                System Health Downtime
            </Heading>

            <HealthTable />
        </Container>
    )
}
