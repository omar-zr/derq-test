import { Box, FormLabel, Input, Table, Tbody, Td, Tr, useColorModeValue } from "@chakra-ui/react";

type Inputs = {
    Car: string;
    Motorcycle: string;
    Pedestrian: string;
    Bicycle: string;
};

type CarsFormProps = {
    values: Inputs;
    setValues: React.Dispatch<React.SetStateAction<Inputs>>;
};

const CarsForm = ({ values, setValues }: CarsFormProps) => {
    const color = useColorModeValue("inherit", "ui.light");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setValues(prev => ({ ...prev, [id]: value }));
    };

    return (
        <Box>
            <Box as="span" display="block" mt={10} mb={5} fontSize="20px">
                Classes
            </Box>
            <Table>
                <Tbody>
                    {['Car', 'Motorcycle', 'Pedestrian', 'Bicycle'].map(attr => (
                        <Tr key={attr}>
                            <Td>
                                <FormLabel color={color}>{attr}</FormLabel>
                            </Td>
                            <Td>
                                <Input
                                    id={attr}
                                    placeholder="%"
                                    type="number"
                                    w="50px"
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

export default CarsForm;
