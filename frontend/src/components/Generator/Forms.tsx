import React from "react";
import { Box, Alert } from "@chakra-ui/react";
import CarsForm from "./CarsForm";
import AttributesForm from "./AttributesForm";
import FailureForm from "./FailureForm";

interface FormsProps {
    carForm: any;
    attributeForm: any;
    failureForm: any;
}

const Forms: React.FC<FormsProps> = ({ carForm, attributeForm, failureForm }) => {
    return (
        <Box mb={12}>
            <Box display="flex" mb={12}>
                <CarsForm values={carForm.values} setValues={carForm.setValues} />
                <AttributesForm values={attributeForm.values} setValues={attributeForm.setValues} />
                <FailureForm values={failureForm.values} setValues={failureForm.setValues} />
            </Box>
            {carForm.error && <Alert status="error" mt={5}>{carForm.error}</Alert>}
            {attributeForm.error && <Alert status="error" mt={5}>{attributeForm.error}</Alert>}
            {failureForm.error && <Alert status="error" mt={5}>{failureForm.error}</Alert>}
        </Box>
    );
};

export default Forms;