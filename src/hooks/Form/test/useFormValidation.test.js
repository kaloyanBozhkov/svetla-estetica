import { act, renderHook } from '@testing-library/react-hooks'

import useFormValidation from '../useFormValidation'

describe('tesitng useFormValidation', () => {
    const genericValidaion = function wihThis() {
            const isValid = this.required && !!this.value

            return isValid
                ? {
                      isValid,
                  }
                : {
                      isValid,
                      error: `${this.name} error msg`,
                  }
        },
        formState = {
            email: {
                type: 'text',
                name: 'email',
                label: 'label',
                required: true,
                validation() {
                    return genericValidaion.call(this)
                },
            },
            password: {
                type: 'password',
                name: 'password',
                label: 'label2',
                required: true,
                validation() {
                    return genericValidaion.call(this)
                },
            },
            confirmPassword: {
                type: 'password',
                name: 'confirmPassword',
                label: 'label3',
                required: true,
                validation(formStateArg) {
                    const fieldSetValidation = genericValidaion.call(this)

                    if (!fieldSetValidation.isValid) {
                        return fieldSetValidation
                    }

                    return formStateArg.password.value === this.value
                        ? {
                              isValid: true,
                          }
                        : {
                              isValid: false,
                              error: 'passwords not matching error msg',
                          }
                },
            },
            notRequiredField: {
                type: 'text',
                name: 'notRequiredField',
                label: 'label4',
                required: false,
            },
        }

    it('should render hook and return obj of invalid fields which is initially empty', () => {
        const { result } = renderHook(() => useFormValidation(formState))

        expect(result.current[0]).toEqual({})
    })

    it('should render hook and when onValidate is ran the invalidFields obj should update with field names for invalid fields and their error msgs', () => {
        const { result } = renderHook(() => useFormValidation(formState)),
            [, onValidate] = result.current

        expect(result.current[0]).toEqual({})

        act(() => {
            // fn returns true/false if valid ornot
            const isValid = onValidate()

            expect(isValid).toBe(false)
        })

        expect(result.current[0]).toEqual({
            [formState.email.name]: 'email error msg',
            [formState.password.name]: 'password error msg',
            [formState.confirmPassword.name]: 'confirmPassword error msg',
        })
    })

    it('should render hook and when onValidate is ran the invalidFields obj should update with field names for invalid field and a default error msg since a unqiue one not configures', () => {
        const { result } = renderHook(() =>
                useFormValidation({
                    noErrorMsgField: {
                        type: 'text',
                        name: 'noErrorMsgField',
                        label: 'label',
                        required: true,
                        validation() {
                            // returns true if valid and false if invalid (instead of a string when invalid)
                            return this.required && !!this.value
                        },
                    },
                })
            ),
            [, onValidate] = result.current

        expect(result.current[0]).toEqual({})

        act(() => {
            // fn returns true/false if valid ornot
            const isValid = onValidate()

            expect(isValid).toBe(false)
        })

        // will tell us to setup a unique error msg for the field
        expect(result.current[0]).toEqual({
            noErrorMsgField: 'Field is invalid - no error msg setup',
        })
    })

    it('should render hook and allow for resetting of all invalid fields if no arg is passed', () => {
        const { result } = renderHook(() =>
                useFormValidation({
                    ...formState,
                    password: {
                        ...formState.password,
                        value: 'initially set',
                    },
                    confirmPassword: {
                        ...formState.confirmPassword,
                        value: 'initially sett not matching',
                    },
                })
            ),
            [, onValidate, onResetValidation] = result.current

        expect(result.current[0]).toEqual({})

        act(() => {
            // fn returns true/false if valid ornot
            const isValid = onValidate()

            expect(isValid).toBe(false)
        })

        // only one field is invalid other has value
        expect(result.current[0]).toEqual({
            [formState.email.name]: 'email error msg',
            [formState.confirmPassword.name]: 'passwords not matching error msg',
        })

        act(() => {
            // resets all error fields if no arg is passed
            onResetValidation()
        })

        expect(result.current[0]).toEqual({})
    })

    it('should render hook and allow for resetting of a single invalid field if fieldName arg is passed', () => {
        const { result } = renderHook(() =>
                useFormValidation({
                    ...formState,
                    password: {
                        ...formState.password,
                        value: 'initially set',
                    },
                    confirmPassword: {
                        ...formState.confirmPassword,
                        value: 'initially sett not matching',
                    },
                })
            ),
            [, onValidate] = result.current

        expect(result.current[0]).toEqual({})

        act(() => {
            // fn returns true/false if valid ornot
            const isValid = onValidate()

            expect(isValid).toBe(false)
        })

        // only one field is invalid other has value
        expect(result.current[0]).toEqual({
            [formState.email.name]: 'email error msg',
            [formState.confirmPassword.name]: 'passwords not matching error msg',
        })

        act(() => {
            // resets all error fields if no arg is passed
            const onResetValidation = result.current[2]
            onResetValidation('email')
        })

        expect(result.current[0]).toEqual({
            [formState.confirmPassword.name]: 'passwords not matching error msg',
        })
    })
})
