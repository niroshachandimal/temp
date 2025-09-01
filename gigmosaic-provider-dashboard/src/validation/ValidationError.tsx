import * as Yup from 'yup';

export const handleValidationError = (
  error: any,
  setError: (errors: { [key: string]: string }) => void,
) => {
  setError({});

  if (error instanceof Yup.ValidationError) {
    const errors: { [key: string]: string } = {};
    error.inner.forEach((err: any) => {
      errors[err.path] = err.message;
    });
    setError(errors);
    return true;
  }

  return false;
};
