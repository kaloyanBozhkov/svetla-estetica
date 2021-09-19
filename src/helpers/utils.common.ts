import type { FormState } from 'common/types'

export const isValidEmail = (email: string): boolean => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

export const isValidPhoneNumber = (value: string): boolean =>
    /^(?:\+\d{1,3}|0\d{1,3}|00\d{1,2})?(?:\s?\(\d+\))?(?:[-/\s.]|\d)+$/.test(value)

export const extractFieldNameValueFromFormState = <T extends Record<string, string>>(
    formState: FormState
): T =>
    Object.keys(formState).reduce(
        (acc, fieldName) => ({
            ...acc,
            [fieldName]: formState[fieldName].value,
        }),
        {} as T
    )
