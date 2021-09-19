import { shallow } from 'enzyme'
import React from 'react'

import FormError from '../FormError'

describe('testing top level FormError', () => {
    it('should render component if valid error str provided', () => {
        expect(shallow(<FormError error="some error" />)).toMatchSnapshot()
    })

    it('should not render anything if error is obj or falsy', () => {
        expect(shallow(<FormError error={{ field: 'error' }} />).find('.errorMsg').length).toBe(0)
        expect(shallow(<FormError />).find('.errorMsg').length).toBe(0)
    })
})
