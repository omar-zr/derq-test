import { useEffect } from "react";
import { GeneratorConfig } from "../client";
import { useGenerator } from "./useGenerator";

export function useFormConfig(initialConfig?: GeneratorConfig) {
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

    useEffect(() => {
        if (initialConfig) {
            carForm.setValues({
                Car: initialConfig.class_prob[0].toString(),
                Motorcycle: initialConfig.class_prob[1].toString(),
                Pedestrian: initialConfig.class_prob[2].toString(),
                Bicycle: initialConfig.class_prob[3].toString(),
            });

            attributeForm.setValues({
                NB: initialConfig.approach_prob[0].toString(),
                SB: initialConfig.approach_prob[1].toString(),
                WB: initialConfig.approach_prob[2].toString(),
                EB: initialConfig.approach_prob[3].toString(),
            });

            failureForm.setValues({
                Percentage: initialConfig.downtime_prob.toString(),
            });
        }
    }, [initialConfig]);

    return { carForm, attributeForm, failureForm };
}
