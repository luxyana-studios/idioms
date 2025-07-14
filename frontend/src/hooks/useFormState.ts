import { useState } from 'react';

interface FormField {
  value: string;
  setter: (value: string) => void;
}

export const useFormState = <T extends Record<string, string>>(
  initialValues: T,
) => {
  const [values, setValues] = useState<T>(initialValues);

  const setValue = (key: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setValues(initialValues);
  };

  const getField = (key: keyof T): FormField => ({
    value: values[key],
    setter: (value: string) => setValue(key, value),
  });

  return {
    values,
    setValue,
    reset,
    getField,
  };
};
