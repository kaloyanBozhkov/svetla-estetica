'use client';

import { Input } from '@/components/atoms';
import { type InputHTMLAttributes } from 'react';
import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
}

export function FormField({ label, registration, error, ...props }: FormFieldProps) {
  return <Input label={label} error={error?.message} {...registration} {...props} />;
}
