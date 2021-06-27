import { shallow } from 'enzyme'
import React from 'react'
import Contacts from '../Contacts'

describe('testing Contacts', () => {
    it('should render component', () => {
        expect(shallow(<Contacts />)).toMatchSnapshot()
    })
})
