import type { FormFieldDefinition, FormFieldProps, FormState } from 'common/types'
import { useReducer, Dispatch } from 'react'

type DispatchedChange = {
    fieldName: FormFieldProps['name']
    fieldValue: FormFieldProps['value']
}

// initializes our form state from the definitions passed to Form
export const formStateInit = (formFieldDefinitions: FormFieldDefinition[]): FormState =>
    formFieldDefinitions.reduce(
        (acc, field) => ({
            ...acc,
            [field.name]: field,
        }),
        {}
    )

const useFormState = (
    formFieldDefinitions: FormFieldDefinition[]
): [FormState, Dispatch<DispatchedChange>] => {
    const [formState, dispatchChange] = useReducer<
        (acc: FormState, dispatchedChange: DispatchedChange) => FormState,
        FormFieldDefinition[]
    >(
        (acc, dispatchedChange) => ({
            ...acc,
            // get the changed value for the field name, keep other config as is
            [dispatchedChange.fieldName]: {
                ...acc[dispatchedChange.fieldName],
                value: dispatchedChange.fieldValue,
            },
        }),
        formFieldDefinitions,
        formStateInit
    )

    return [formState, dispatchChange]
}

export default useFormState
