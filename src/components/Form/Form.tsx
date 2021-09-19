// import common types
import type { ReactElement } from 'react'
import type { FormFieldDefinition, FormState } from 'common/types'
import { InputProps } from 'components/UI/Input/Input'

// import hooks
import useFormState from 'hooks/Form/useFormState'
import useFormValidation from 'hooks/Form/useFormValidation'

// import components
import Button from 'components/UI/Button/Button'
import Icon from 'components/UI/Icon/Icon'
import FormField from './FormField/FormField'

// import styles
import styles from './styles.module.scss'

type FormProps = {
    definitions: FormFieldDefinition[]
    formId?: string
    isSubmitPending?: boolean
    submitLabel: string
    fieldModifier?: InputProps['modifier']
    // BE provided errors obj following submit
    fieldErrors?: Record<string, string>
    onSubmit?: (formState: FormState) => void | boolean
    onFormStateChanged?: (fieldName: string) => void
    onFormFieldFocused?: (fieldName: string) => void
}

/**
 *
 * @param formId string to identify form element and apply custom styles from parent
 * @param action form action attribute
 * @param method 'POST' | 'GET'
 * @param definitions FormFieldDefinition[] -> what fields to render, what their label/validation/requirement is etc..
 * @param isSubmitPending boolean -> renders loading spinner instead of btn indicative or pending operation
 * @param submitLabel string for submit btn label
 * @param fieldErrors
 * @param onSubmit fn to call on submit click, prevents default behavior runs fn and then submits form
 * @param onFormStateChanged fn to call when form state has changed -> useful for events relative to on form field change
 * @param onFormFieldFocused fn to call when a form field has been focused -> useful for removing fieldErrors or triggering smth on form field focus
 * @returns Form ReactElement
 */
const Form = ({
    formId,
    definitions,
    submitLabel = 'Submit',
    fieldModifier = 'base',
    fieldErrors = {},
    isSubmitPending = false,
    onSubmit,
    onFormStateChanged,
    onFormFieldFocused,
}: FormProps): ReactElement => {
    const [formState, dispatchChange] = useFormState(definitions),
        [invalidFields, onValidate, onResetValidation] = useFormValidation(formState)

    return (
        <form className={styles.form} form-id={formId}>
            {Object.values(formState).map((field) => (
                <FormField
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    label={field.label}
                    value={field.value}
                    required={field.required}
                    modifier={fieldModifier}
                    // either from FE's invalidFields (pre submit) or BE's fieldErrors (post submit)
                    errorMsg={invalidFields[field.name] || fieldErrors[field.name]}
                    description={field.description}
                    hasErrored={!!invalidFields[field.name] || !!fieldErrors[field.name]}
                    onChange={({ target: { value: fieldValue } }) => {
                        // update field value
                        dispatchChange({ fieldValue, fieldName: field.name })

                        if (invalidFields[field.name]) {
                            onResetValidation(field.name)
                        }

                        // on change of field if we have a fn to run let's run it and pass field name of changed form field
                        onFormStateChanged?.(field.name)
                    }}
                    onFocus={() => {
                        // if field is invalid let's reset it
                        if (invalidFields[field.name]) {
                            onResetValidation(field.name)
                        }

                        // on focus of field run the fn if we have passed it as prop
                        onFormFieldFocused?.(field.name)
                    }}
                />
            ))}
            {isSubmitPending ? (
                <Button type="button" label={<Icon icon="spinner" />} />
            ) : (
                <Button
                    modifier={(Object.values(invalidFields).length && 'denied') || undefined}
                    type="submit"
                    label={submitLabel}
                    onClick={(e) => {
                        // prevent default form behavior
                        e.preventDefault()

                        if (onValidate()) {
                            onSubmit?.(formState)
                        }
                    }}
                />
            )}
        </form>
    )
}

export default Form
