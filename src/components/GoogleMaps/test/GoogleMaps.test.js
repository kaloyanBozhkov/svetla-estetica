import { shallow } from 'enzyme'
import React from 'react'
import GoogleMaps from '../GoogleMaps'

describe('testing GoogleMaps', () => {
    it('should render component', () => {
        expect(shallow(<GoogleMaps />)).toMatchSnapshot()
    })
})
