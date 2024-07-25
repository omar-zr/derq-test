import { Box, FormLabel, Input, Table, Tbody, Tr, Td, useColorModeValue } from '@chakra-ui/react';

type Inputs = {
    NB: string;
    SB: string;
    WB: string;
    EB: string;
};

type AttributesFormProps = {
    values: Inputs;
    setValues: React.Dispatch<React.SetStateAction<Inputs>>;
};

const AttributesForm = ({ values, setValues }: AttributesFormProps) => {
    const color = useColorModeValue("inherit", "ui.light");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setValues(prev => ({ ...prev, [id]: value }));
    };

    return (
        <Box ml={10}>
            <Box as="span" display="block" mt={10} mb={5} fontSize="20px">
                Attributes
            </Box>
            <Table>
                <Tbody>
                    {['NB', 'SB', 'WB', 'EB'].map(attr => (
                        <Tr key={attr}>
                            <Td>
                                <FormLabel color={color}>{attr}</FormLabel>
                            </Td>
                            <Td>
                                <Input
                                    id={attr}
                                    placeholder="%"
                                    type="number"
                                    w="75px"
                                    value={values[attr as keyof Inputs]}
                                    onChange={handleChange}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default AttributesForm;
