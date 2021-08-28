import React from 'react'
import { shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'

// import components
import MailUs from '../MailUs'

// mock the helper
jest.mock('services/sendMail')

describe('testing MailUs', () => {
    it('should render component', () => {
        expect(shallow(<MailUs />)).toMatchSnapshot()
    })

    it('should handle setting input values', () => {
        const wrapper = shallow(<MailUs />)
        let inputs = wrapper.find('Input'),
            onNameInputChange = inputs.at(0).prop('onChange')

        expect(inputs.at(0).prop('value')).toBe('')

        act(() => {
            onNameInputChange({ target: { value: 'hello' } })
        })

        wrapper.update()

        inputs = wrapper.find('Input').at(0)

        expect(inputs.prop('value')).toBe('hello')
    })

    it('should disable btn and not run sendMail if not all inputs are set', () => {
        const wrapper = shallow(<MailUs />),
            btn = wrapper.find('Button')

        expect(btn.parent().prop('data-is-disabled')).toBe(true)

        btn.prop('onClick')()

        expect(sendMail).toHaveBeenCalledTimes(0)
    })

    it('should disable btn and not run sendMail if not all inputs are set', () => {
        const wrapper = shallow(<MailUs />),
            inputs = wrapper.find('Input')
        let btn = wrapper.find('Button')

        expect(sendMail).toHaveBeenCalledTimes(0)

        expect(btn.parent().prop('data-is-disabled')).toBe(true)

        act(() => {
            inputs.forEach((input) => {
                input.prop('onChange')({ target: { value: 'hello' } })
            })
        })

        wrapper.update()

        btn = wrapper.find('Button')

        expect(btn.parent().prop('data-is-disabled')).toBe(false)

        btn.prop('onClick')()

        expect(sendMail).toHaveBeenCalledTimes(1)
    })
})
