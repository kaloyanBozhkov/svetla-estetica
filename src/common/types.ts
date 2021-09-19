import type { InputProps } from 'components/UI/Input/Input'

export type FormFieldProps = {
    hasErrored?: boolean
    errorMsg?: string
} & InputProps

export type Validation =
    | {
          isValid: true
      }
    | {
          isValid: false
          error: string
      }

export type FormFieldDefinition = Omit<FormFieldProps, 'onChange' | 'onFocus' | 'onBlur'> & {
    required: boolean
    // true if valid field, string if invalid and has error message, false if invalid but no error msg
    validation: (formState: FormState) => Validation
}

export type FormState = Record<FormFieldProps['name'], FormFieldDefinition>

export type FormFieldErrors = Record<string, string>

export type APIErrorResponse = { error: string }

export type FormErrorType = FormFieldErrors | string | null
