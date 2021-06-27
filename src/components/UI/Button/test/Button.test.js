import React from 'react'
import { shallow } from 'enzyme'
import Button from '../Button'

describe('testing BUtton', () => {
    it('should render atom', () => {
        expect(
            shallow(<Button label="Some Label" onClick={jest.fn()} modifier="hallow" />)
        ).toMatchSnapshot()
    })

    it('should fire onClick fn', () => {
        const mockClick = jest.fn(),
            wrapper = shallow(<Button label="Some Label" onClick={mockClick} modifier="hallow" />)
        wrapper.prop('onClick')()
        expect(mockClick).toHaveBeenCalled()
    })
})
