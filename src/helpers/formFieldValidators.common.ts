import type { FormFieldDefinition, FormState, Validation } from 'common/types'

import { isValidEmail, isValidPhoneNumber } from './utils.common'

/**
 * All form field validators should be function declarations that have their this bound to the FormState's FormDefinition obj
 * @returns true if validation passes or a string if validation failed
 */

export function isFieldSet(this: FormFieldDefinition): Validation {
    const isValid = this.required && !!this.value

    return isValid
        ? {
              isValid,
          }
        : {
              isValid,
              error: 'Campo mancante',
          }
}

export function isEmailFieldValid(this: FormFieldDefinition): Validation {
    const isFieldSetValidation = isFieldSet.call(this)

    if (!isFieldSetValidation.isValid) {
        return isFieldSetValidation
    }

    return isValidEmail(this.value as string)
        ? {
              isValid: true,
          }
        : {
              isValid: false,
              error: `L'email non sembra essere valida`,
          }
}

export function isPhoneFieldValid(this: FormFieldDefinition): Validation {
    const isFieldSetValidation = isFieldSet.call(this)

    if (!isFieldSetValidation.isValid) {
        return isFieldSetValidation
    }

    return isValidPhoneNumber(this.value as string)
        ? {
              isValid: true,
          }
        : {
              isValid: false,
              error: `Il numero telefonico non sembra essere valido`,
          }
}

export function isMatchingField(
    this: FormFieldDefinition,
    formState: FormState,
    fieldNameToCompare: string,
    errorMsg: string
): Validation {
    const isFieldSetValidation = isFieldSet.call(this)

    if (!isFieldSetValidation.isValid) {
        return isFieldSetValidation
    }

    return formState[fieldNameToCompare].value === this.value
        ? {
              isValid: true,
          }
        : {
              isValid: false,
              error: errorMsg,
          }
}
