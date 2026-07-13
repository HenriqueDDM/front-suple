import { useCallback, useState } from "react";

export function useFormState<T extends object>(initialValues: T) {
  const [form, setForm] = useState<T>(initialValues);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  }, []);

  const reset = useCallback(
    (values: T = initialValues) => {
      setForm(values);
    },
    [initialValues],
  );

  return { form, setForm, setField, reset };
}
