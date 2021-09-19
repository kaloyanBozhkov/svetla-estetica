import { shallow } from 'enzyme'
import React from 'react'
import Header from '../Header'

describe('testing Header', () => {
    it('should render component', () => {
        expect(shallow(<Header />)).toMatchSnapshot()
    })
})
