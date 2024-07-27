import { Box, FormLabel, Input, Table, Tbody, Td, Tr, useColorModeValue, Alert } from "@chakra-ui/react";
import { useState } from "react";

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
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const newValues = { ...values, [id]: value };
        const sum = Object.values(newValues).reduce((acc, curr) => acc + parseFloat(curr || "0"), 0);

        if (sum > 1) {
            setError("The sum of all values must not exceed 1.");
        } else {
            setError(null);
        }

        setValues(newValues);
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
                                    w="75px"
                                    value={values[attr as keyof Inputs]}
                                    onChange={handleChange}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {error && <Alert status="error" mt={4}>{error}</Alert>}
        </Box>
    );
};

export default CarsForm;
