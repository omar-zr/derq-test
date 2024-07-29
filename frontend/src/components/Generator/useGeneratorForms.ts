import { useState } from "react";
import { useGenerator } from "../../hooks/useGenerator";
import { GeneratorConfig, GeneratorService } from "../../client";

const useGeneratorForms = () => {
    const carForm = useGenerator({
        Car: "",
        Motorcycle: "",
        Pedestrian: "",
        Bicycle: "",
    });

    const attributeForm = useGenerator({
        NB: "",
        SB: "",
        WB: "",
        EB: "",
    });

    const failureForm = useGenerator({
        CountsRate: "",
        Downtime: "",
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const validateForms = () => {
        const isCarFormValid = carForm.validate();
        const isAttributeFormValid = attributeForm.validate();
        const isFailureFormValid = failureForm.validate();

        const carFormSum = Object.values(carForm.values).reduce((acc, curr) => acc + parseFloat(curr || "0"), 0);
        const attributeFormSum = Object.values(attributeForm.values).reduce((acc, curr) => acc + parseFloat(curr || "0"), 0);

        if (carFormSum !== 1) {
            setErrorMessage("The sum of all car form values must be 1.");
            return false;
        }

        if (attributeFormSum !== 1) {
            setErrorMessage("The sum of all attribute form values must be 1.");
            return false;
        }

        return isCarFormValid && isAttributeFormValid && isFailureFormValid;
    };

    const handleSubmit = async () => {
        if (validateForms()) {
            const config: GeneratorConfig = {
                counts_rate: parseFloat(failureForm.values.CountsRate),
                approach_prob: [
                    parseFloat(attributeForm.values.NB),
                    parseFloat(attributeForm.values.SB),
                    parseFloat(attributeForm.values.WB),
                    parseFloat(attributeForm.values.EB),
                ],
                class_prob: [
                    parseFloat(carForm.values.Car),
                    parseFloat(carForm.values.Motorcycle),
                    parseFloat(carForm.values.Pedestrian),
                    parseFloat(carForm.values.Bicycle),
                ],
                downtime_prob: parseFloat(failureForm.values.Downtime),
            };
            try {
                await GeneratorService.configureGenerator(config);
                await GeneratorService.startGenerator();
            } catch (error) {
                setErrorMessage("Failed to start generator");
            }
        }
    };

    const handleStop = async () => {
        try {
            await GeneratorService.stopGenerator();
        } catch (error) {
            setErrorMessage("Failed to stop generator");
        }
    };

    return { carForm, attributeForm, failureForm, validateForms, handleSubmit, handleStop, errorMessage };
};

export default useGeneratorForms;