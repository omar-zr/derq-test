import { useState } from "react";

type FormState<T> = {
    values: T;
    setValues: React.Dispatch<React.SetStateAction<T>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    validate: () => boolean;
};

export const useGenerator = <T extends Record<string, any>>(initialState: T): FormState<T> => {
    const [values, setValues] = useState(initialState);
    const [error, setError] = useState('');

    const validate = () => {
        const emptyFields = (Object.keys(values) as Array<keyof T>).filter(key => !values[key]);
        if (emptyFields.length > 0) {
            setError(`Please fill in the following fields: ${emptyFields.join(', ').toUpperCase()}`);
            return false;
        } else {
            setError('');
            return true;
        }
    };

    return {
        values,
        setValues,
        error,
        setError,
        validate,
    };
};
