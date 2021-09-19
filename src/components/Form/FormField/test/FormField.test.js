import React from 'react'
import { shallow } from 'enzyme'

import FormField from '../FormField'

describe('testing FormField', () => {
    const formFieldConfigs = {
        input: {
            type: 'textarea',
            label: 'title',
            name: 'fieldName',
            value: '',
            modifier: undefined,
            required: true,
            hasErrored: false,
            errorMsg: undefined,
            description: undefined,
            onChange: jest.fn(),
            onFocus: jest.fn(),
            onBlur: jest.fn(),
        },
    }

    beforeEach(() => {
        formFieldConfigs.input.onFocus.mockReset()
        formFieldConfigs.input.onBlur.mockReset()
        formFieldConfigs.input.onChange.mockReset()
    })

    it('should render component', () => {
        const wrapper = shallow(<FormField {...formFieldConfigs.input} />)

        expect(wrapper).toMatchSnapshot()
    })

    it('should render text input with error msg if property set', () => {
        const wrapper = shallow(<FormField {...formFieldConfigs.input} errorMsg="some error" />)

        expect(wrapper.find('.errorMsg').text()).toEqual('some error')
    })

    it('should render text input with description if property set', () => {
        const wrapper = shallow(
            <FormField {...formFieldConfigs.input} description="some description" />
        )

        expect(wrapper.find('.desc').text()).toEqual('some description')
    })

    it('should render fallback text tag', () => {
        const wrapper = shallow(<FormField {...formFieldConfigs.input} type="nonexistant" />)

        expect(wrapper.find('p').text()).toEqual('type nonexistant not configured')
    })
})
