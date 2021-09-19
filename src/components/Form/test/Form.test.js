import React from 'react'
import { shallow } from 'enzyme'

// import hooks
import * as useFormValidationModuels from 'hooks/Form/useFormValidation'
import * as useFormStateModules from 'hooks/Form/useFormState'

// import atom
import Icon from 'components/UI/Icon/Icon'

// import component
import Form from '../Form'

describe('testing Form', () => {
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

    it('should render component', () => {
        const wrapper = shallow(<Form formId="someId" definitions={definitions} />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should pass our field definitions to useFormState hook and also on change of field should dispatch the hooks dispatchChange', () => {
        const mockDispatchChange = jest.fn(),
            mockUseFormState = jest.fn(() => [
                {
                    [definitions[0].name]: {
                        ...definitions[0],
                    },
                },
                mockDispatchChange,
            ])

        jest.spyOn(useFormStateModules, 'default').mockImplementationOnce(mockUseFormState)

        expect(useFormStateModules.default).toHaveBeenCalledTimes(0)

        const wrapper = shallow(<Form formId="someId" definitions={definitions} />)

        // hook called on mount
        expect(useFormStateModules.default).toHaveBeenCalledTimes(1)

        // hook called wiht our definitions
        expect(useFormStateModules.default).toHaveBeenCalledWith(definitions)

        expect(mockDispatchChange).toHaveBeenCalledTimes(0)

        wrapper.find('FormField').prop('onChange')({ target: { value: 'new value' } })

        expect(mockDispatchChange).toHaveBeenCalledTimes(1)

        expect(mockDispatchChange).toHaveBeenCalledWith({
            fieldName: 'email',
            fieldValue: 'new value',
        })
    })

    it('should run onFormStateChanged for FormField when field value changed', () => {
        const mockDispatchChange = jest.fn(),
            mockFormStateChanged = jest.fn(),
            mockUseFormState = jest.fn(() => [
                {
                    [definitions[0].name]: {
                        ...definitions[0],
                    },
                },
                mockDispatchChange,
            ])

        jest.spyOn(useFormStateModules, 'default').mockImplementationOnce(mockUseFormState)

        const wrapper = shallow(
            <Form
                formId="someId"
                definitions={definitions}
                onFormStateChanged={mockFormStateChanged}
            />
        )

        expect(mockFormStateChanged).toHaveBeenCalledTimes(0)

        wrapper.find('FormField').prop('onChange')({ target: { value: 'new value' } })

        expect(mockFormStateChanged).toHaveBeenCalledTimes(1)
    })

    it('should run onFormFieldFocused for FormField when field focused', () => {
        const mockDispatchChange = jest.fn(),
            mockFormFieldFocused = jest.fn(),
            mockUseFormState = jest.fn(() => [
                {
                    [definitions[0].name]: {
                        ...definitions[0],
                    },
                },
                mockDispatchChange,
            ])

        jest.spyOn(useFormStateModules, 'default').mockImplementationOnce(mockUseFormState)

        const wrapper = shallow(
            <Form
                formId="someId"
                definitions={definitions}
                onFormFieldFocused={mockFormFieldFocused}
            />
        )

        expect(mockFormFieldFocused).toHaveBeenCalledTimes(0)

        wrapper.find('FormField').prop('onFocus')()

        expect(mockFormFieldFocused).toHaveBeenCalledTimes(1)
        expect(mockFormFieldFocused).toHaveBeenCalledWith('email')
    })

    it('should run validation fns when submit pressed and then run onSubmit', () => {
        // return false to indicate at least 1 invalid field
        const mockOnValidate = jest.fn(() => false),
            mockOnSubmit = jest.fn(),
            mockPreventDefault = jest.fn(),
            mockUseFormValidation = jest.fn(() => [
                { fieldName: 'invalid error msg' },
                mockOnValidate,
            ]),
            spy = jest
                .spyOn(useFormValidationModuels, 'default')
                .mockImplementation(mockUseFormValidation)

        expect(useFormValidationModuels.default).toHaveBeenCalledTimes(0)

        const wrapper = shallow(
            <Form formId="someId" definitions={definitions} onSubmit={mockOnSubmit} />
        )

        // hook called on mount
        expect(useFormValidationModuels.default).toHaveBeenCalledTimes(1)

        expect(mockOnValidate).toHaveBeenCalledTimes(0)

        // submit form
        wrapper.find('Button').prop('onClick')({ preventDefault: mockPreventDefault })

        // e.preventDefault called and form submit behavior stopped
        expect(mockPreventDefault).toHaveBeenCalledTimes(1)

        // onValidate called
        expect(mockOnValidate).toHaveBeenCalledTimes(1)

        // onSubmit not called
        expect(mockOnSubmit).toHaveBeenCalledTimes(0)

        spy.mockRestore()
    })

    it('should run validation fns when submit pressed but not run onSubmit fn since validaiton returned fale', () => {
        // return true to simulate no invalid fields
        const mockOnValidate = jest.fn(() => true),
            mockOnSubmit = jest.fn(),
            mockPreventDefault = jest.fn(),
            mockUseFormValidation = jest.fn(() => [['invalidFieldName'], mockOnValidate]),
            spy = jest
                .spyOn(useFormValidationModuels, 'default')
                .mockImplementation(mockUseFormValidation)

        expect(useFormValidationModuels.default).toHaveBeenCalledTimes(0)

        const wrapper = shallow(
            <Form formId="someId" definitions={definitions} onSubmit={mockOnSubmit} />
        )

        // hook called on mount
        expect(useFormValidationModuels.default).toHaveBeenCalledTimes(1)

        expect(mockOnValidate).toHaveBeenCalledTimes(0)

        // submit form
        wrapper.find('Button').prop('onClick')({ preventDefault: mockPreventDefault })

        // e.preventDefault called and form submit behavior stopped
        expect(mockPreventDefault).toHaveBeenCalledTimes(1)

        // onValidate called
        expect(mockOnValidate).toHaveBeenCalledTimes(1)

        // onSubmit called
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)

        spy.mockReset()
    })

    it('should set hasErrored to FormField if invalidInputs obj has the field name', () => {
        const mockOnValidate = jest.fn(() => 'set invalid field name'),
            mockDispatchChange = jest.fn(),
            mockOnResetValidation = jest.fn(),
            mockUseFormValidation = jest.fn(() => [
                { [definitions[0].name]: 'error msg' },
                mockOnValidate,
                mockOnResetValidation,
            ]),
            spy = jest
                .spyOn(useFormValidationModuels, 'default')
                .mockImplementation(mockUseFormValidation),
            mockUseFormState = jest.fn(() => [
                {
                    [definitions[0].name]: {
                        ...definitions[0],
                    },
                    [definitions[1].name]: {
                        ...definitions[1],
                    },
                },
                mockDispatchChange,
            ])

        jest.spyOn(useFormStateModules, 'default').mockImplementationOnce(mockUseFormState)

        const wrapper = shallow(<Form formId="someId" definitions={definitions} />)

        // first field hasError set to true de to
        expect(wrapper.find('FormField').at(0).prop('hasErrored')).toEqual(true)

        // second field does not have it set since useFormValidation hook's returned invalid array does not list the filed name
        expect(wrapper.find('FormField').at(1).prop('hasErrored')).toEqual(false)

        spy.mockReset()
    })

    it('should run onResetValidation with field name if invalidInputs obj has error for that field (on change and focus)', () => {
        const mockOnValidate = jest.fn(() => 'set invalid field name'),
            mockDispatchChange = jest.fn(),
            mockOnResetValidation = jest.fn(),
            mockUseFormValidation = jest.fn(() => [
                { [definitions[0].name]: 'error msg' },
                mockOnValidate,
                mockOnResetValidation,
            ]),
            spy = jest
                .spyOn(useFormValidationModuels, 'default')
                .mockImplementation(mockUseFormValidation),
            mockUseFormState = jest.fn(() => [
                {
                    [definitions[0].name]: {
                        ...definitions[0],
                    },
                    [definitions[1].name]: {
                        ...definitions[1],
                    },
                },
                mockDispatchChange,
            ])

        jest.spyOn(useFormStateModules, 'default').mockImplementationOnce(mockUseFormState)

        const wrapper = shallow(<Form formId="someId" definitions={definitions} />),
            emailFormField = wrapper.find('FormField').at(0)

        expect(mockOnResetValidation).toHaveBeenCalledTimes(0)

        emailFormField.prop('onChange')({ target: { value: 'new value' } })

        expect(mockOnResetValidation).toHaveBeenCalledTimes(1)
        expect(mockOnResetValidation).toHaveBeenLastCalledWith('email')

        emailFormField.prop('onFocus')()

        expect(mockOnResetValidation).toHaveBeenCalledTimes(2)
        expect(mockOnResetValidation).toHaveBeenLastCalledWith('email')

        spy.mockReset()
    })

    it('should have a submit btn with modifier set to denied if invalidFields contain a value', () => {
        const mockOnValidate = jest.fn(() => 'set invalid field name'),
            mockDispatchChange = jest.fn(),
            mockOnResetValidation = jest.fn(),
            mockUseFormValidation = jest.fn(() => [
                { [definitions[0].name]: 'error msg' },
                mockOnValidate,
                mockOnResetValidation,
            ]),
            spy = jest
                .spyOn(useFormValidationModuels, 'default')
                .mockImplementation(mockUseFormValidation),
            mockUseFormState = jest.fn(() => [
                {
                    [definitions[0].name]: {
                        ...definitions[0],
                    },
                },
                mockDispatchChange,
            ])

        jest.spyOn(useFormStateModules, 'default').mockImplementationOnce(mockUseFormState)

        const wrapper = shallow(<Form formId="someId" definitions={definitions} />)

        // first field hasError set to true de to
        expect(wrapper.find('Button').prop('modifier')).toEqual('denied')

        spy.mockReset()
    })

    it('should render button with spinner if isSubmitPending set to true', () => {
        const mockOnValidate = jest.fn(() => 'set invalid field name'),
            mockDispatchChange = jest.fn(),
            mockOnResetValidation = jest.fn(),
            mockUseFormValidation = jest.fn(() => [
                { [definitions[0].name]: 'error msg' },
                mockOnValidate,
                mockOnResetValidation,
            ]),
            spy = jest
                .spyOn(useFormValidationModuels, 'default')
                .mockImplementation(mockUseFormValidation),
            mockUseFormState = jest.fn(() => [
                {
                    [definitions[0].name]: {
                        ...definitions[0],
                    },
                },
                mockDispatchChange,
            ])

        jest.spyOn(useFormStateModules, 'default').mockImplementationOnce(mockUseFormState)

        const wrapper = shallow(<Form formId="someId" definitions={definitions} isSubmitPending />)

        // btn has rendered an icon spinner instead of a label
        expect(wrapper.find('Button').prop('label')).toEqual(<Icon icon="spinner" />)

        spy.mockReset()
    })
})
