import React from 'react'
import { shallow } from 'enzyme'
import Heading from '../Heading'

describe('testing SeactionHeading', () => {
    it('should render component', () => {
        expect(shallow(<Heading label="Some Section Label" />)).toMatchSnapshot()
    })

    it('should render heading with an action btn', () => {
        const mockClick = jest.fn(),
            wrapper = shallow(
                <Heading buttonProps={{ label: 'Some label', onClick: mockClick }} />
            ),
            btn = wrapper.find('Button')

        expect(btn.length).toBe(1)
        btn.prop('onClick')()
        expect(mockClick).toHaveBeenCalled()
    })
})
