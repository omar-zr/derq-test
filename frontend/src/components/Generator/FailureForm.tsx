import { Box, FormLabel, Input, Table, Tbody, Td, Tr, useColorModeValue } from "@chakra-ui/react";

type Inputs = {
    CountsRate: string;
    Downtime: string;
};

type FailureFormProps = {
    values: Inputs;
    setValues: React.Dispatch<React.SetStateAction<Inputs>>;
};

const FailureForm = ({ values, setValues }: FailureFormProps) => {
    const color = useColorModeValue("inherit", "ui.light");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setValues(prev => ({ ...prev, [id]: value }));
    };

    return (
        <Box ml={10}>
            <Box as="span" display="block" mt={10} mb={5} fontSize="20px">
                Failure
            </Box>
            <Table>
                <Tbody>
                    <Tr>
                        <Td>
                            <FormLabel color={color}>Counts rate</FormLabel>
                        </Td>
                        <Td>
                            <Input
                                id="CountsRate"
                                placeholder="%"
                                type="number"
                                w="75px"
                                value={values.CountsRate}
                                onChange={handleChange}
                            />
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>
                            <FormLabel color={color}>Downtime</FormLabel>
                        </Td>
                        <Td>
                            <Input
                                id="Downtime"
                                placeholder="%"
                                type="number"
                                w="75px"
                                value={values.Downtime}
                                onChange={handleChange}
                            />
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    );
};

export default FailureForm;
