import React, { useState } from 'react';

import { AnySchema } from 'yup';

export type ValidationErrorType = {
  field: string;
  key: string;
  message: string;
};

export default function useValidation(yupSchema: AnySchema) {
  const [schema, setSchema] = useState(yupSchema);
  const [errors, setErrors] = useState<Record<string, ValidationErrorType>>({});

  function shapeErrors(
    errors: ValidationErrorType[],
  ): Record<string, ValidationErrorType> {
    return Object.fromEntries(errors.map((error) => [error.field, error]));
  }

  function clearError(field: string) {
    const newErrors = {
      ...errors,
    };
    delete newErrors[field];
    setErrors(newErrors);
  }

  function validationProps(field: string) {
    const error = errors[field];

    if (!error) {
      return {};
    }

    return {
      invalidText: error.message,
      invalid: true,
    };
  }

  async function validate(value: any): Promise<boolean> {
    try {
      await schema.validate(value, { abortEarly: false });
      return true;
    } catch (err: any) {
      setErrors(shapeErrors(err.errors));
    }
    return false;
  }

  return {
    schema,
    setSchema,
    errors,
    validate,
    validationProps,
    clearError,
  };
}
