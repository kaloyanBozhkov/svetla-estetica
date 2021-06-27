import { shallow } from 'enzyme'
import React from 'react'
import Slide1 from '../Slide1'

describe('testing Slider slides', () => {
    it('should render Slide1', () => {
        expect(shallow(<Slide1 />)).toMatchSnapshot()
    })

    it('should change location href on btn click', () => {
        const wrapper = shallow(<Slide1 />),
            btn = wrapper.find('Button')
        window.location.href = ''
        expect(window.location.href.includes('#listino')).toBeFalsy()
        btn.prop('onClick')()
        expect(window.location.href.includes('#listino')).toBeTruthy()
    })
})
