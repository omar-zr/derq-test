import { Box, Button, Container, Heading, Alert } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import CarsForm from "../../components/Generator/CarsForm";
import AttributesForm from "../../components/Generator/AttributesForm";
import FailureForm from "../../components/Generator/FailureForm";
import { useGenerator } from "../../hooks/useGenerator";

export const Route = createFileRoute("/_layout/generator")({
    component: Generator,
});

function Generator() {
    const carForm = useGenerator({
        Car: '',
        Motorcycle: '',
        Pedestrian: '',
        Bicycle: ''
    });

    const attributeForm = useGenerator({
        NB: '',
        SB: '',
        WB: '',
        EB: ''
    });

    const failureForm = useGenerator({
        Percentage: ''
    });

    const handleSubmit = () => {
        const isCarFormValid = carForm.validate();
        const isAttributeFormValid = attributeForm.validate();
        const isFailureFormValid = failureForm.validate();

        if (isCarFormValid && isAttributeFormValid && isFailureFormValid) {
            console.log('Car Form Data:', carForm.values);
            console.log('Attribute Form Data:', attributeForm.values);
            console.log('Failure Form Data:', failureForm.values);
        }
    };

    return (
        <Container maxW="full">
            <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
                Generator
            </Heading>
            <Box mb={4}>
                <Box as="span" mr={2} fontSize="20px">
                    Status
                </Box>
                <Box
                    width="15px"
                    height="15px"
                    borderRadius="50%"
                    bg="green"
                    display="inline-block"
                />
            </Box>
            <Box display="flex" mb={12}>
                <CarsForm values={carForm.values} setValues={carForm.setValues} />
                <AttributesForm values={attributeForm.values} setValues={attributeForm.setValues} />
                <FailureForm values={failureForm.values} setValues={failureForm.setValues} />
            </Box>
            {carForm.error && <Alert status="error" mt={5}>{carForm.error}</Alert>}
            {attributeForm.error && <Alert status="error" mt={5}>{attributeForm.error}</Alert>}
            {failureForm.error && <Alert status="error" mt={5}>{failureForm.error}</Alert>}
            <Button
                colorScheme="blue"
                gap={1}
                fontSize={{ base: "sm", md: "inherit" }}
                onClick={handleSubmit}
            >
                Run
            </Button>
        </Container>
    );
}

export default Generator;
