import { Box, FormLabel, Input, Table, Tbody, Td, Tr, useColorModeValue } from "@chakra-ui/react";

type Inputs = {
    Percentage: string;
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
                            <FormLabel color={color}>Percentage</FormLabel>
                        </Td>
                        <Td>
                            <Input
                                id="Percentage"
                                placeholder="%"
                                type="number"
                                w="75px"
                                value={values.Percentage}
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
