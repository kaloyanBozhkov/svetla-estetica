import React from 'react'
import { shallow } from 'enzyme'

import Icon from '../Icon'

describe('testing Icon atom', () => {
    it('should render Icon with no icon found', () => {
        expect(shallow(<Icon />)).toMatchSnapshot()
    })
})
