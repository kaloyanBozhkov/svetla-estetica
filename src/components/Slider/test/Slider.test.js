import { shallow } from 'enzyme'
import React from 'react'
import Slider from '../Slider'

describe('testing Slider', () => {
    it('should render component', () => {
        expect(shallow(<Slider />)).toMatchSnapshot()
    })
})
