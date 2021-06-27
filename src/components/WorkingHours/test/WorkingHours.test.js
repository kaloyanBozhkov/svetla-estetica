import { shallow } from 'enzyme'
import React from 'react'
import WorkingHours from '../WorkingHours'

describe('testing WorkingHours', () => {
    it('should render component', () => {
        expect(shallow(<WorkingHours />)).toMatchSnapshot()
    })
})