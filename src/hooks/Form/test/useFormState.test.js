import { act, renderHook } from '@testing-library/react-hooks'

// import hook & pure fn
import useFormState, { formStateInit } from '../useFormState'

describe('testing useFormState hook', () => {
    const definitions = [
        {
            type: 'text',
            name: 'email',
            label: 'label',
            required: true,
            validation() {
                return this.required && !!this.value
            },
        },
        {
            type: 'password',
            name: 'password',
            label: 'label2',
            required: true,
            validation() {
                return this.required && !!this.value
            },
        },
    ]

    it('should format initial form state from form definitions array passed', () => {
        expect(formStateInit(definitions)).toEqual({
            [definitions[0].name]: {
                ...definitions[0],
            },
            [definitions[1].name]: {
                ...definitions[1],
            },
        })
    })

    it('should render hook and return formatted form state and a fn to dispatch a change', () => {
        const { result } = renderHook(() => useFormState(definitions)),
            formattedFormState = {
                [definitions[0].name]: {
                    ...definitions[0],
                },
                [definitions[1].name]: {
                    ...definitions[1],
                },
            }

        expect(result.current[0]).toEqual(formattedFormState)
    })

    it('should unpdate state when dispatchChange fn is ran', () => {
        const { result } = renderHook(() => useFormState(definitions)),
            dispatchChange = result.current[1]

        // value not set initially
        expect(result.current[0][definitions[0].name].value).toEqual(undefined)

        act(() => {
            dispatchChange({ fieldName: definitions[0].name, fieldValue: 'new value' })
        })

        // value set following dispatched change
        expect(result.current[0][definitions[0].name].value).toEqual('new value')
    })
})
