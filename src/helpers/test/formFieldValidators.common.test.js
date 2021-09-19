import { isEmailFieldValid, isFieldSet } from '../formFieldValidators.common'

describe('testing formFieldValidators helpers', () => {
    describe('testing isFieldSet', () => {
        it('should return errored validation obj', () => {
            const fieldDef = {
                value: '',
                required: true,
                validation: isFieldSet,
            }

            expect(fieldDef.validation()).toEqual({
                isValid: false,
                error: 'Campo mancante',
            })
        })

        it('should return valid validation obj', () => {
            const fieldDef = {
                value: 'set',
                required: true,
                validation: isFieldSet,
            }

            expect(fieldDef.validation()).toEqual({
                isValid: true,
            })
        })
    })

    describe('testing isEmailFieldValid', () => {
        it('should retur errored validation obj', () => {
            const fieldDef = {
                value: 'invalid email',
                required: true,
                validation: isEmailFieldValid,
            }

            expect(fieldDef.validation()).toEqual({
                isValid: false,
                error: "L'email non sembra essere valida",
            })
        })

        it('should return valid validation obj', () => {
            const fieldDef = {
                value: 'set@email.yes',
                required: true,
                validation: isEmailFieldValid,
            }

            expect(fieldDef.validation()).toEqual({
                isValid: true,
            })
        })
    })
})
