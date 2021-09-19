import React from 'react'
import { shallow } from 'enzyme'

// import components
import MailUs from '../MailUs'

// mock the helper
jest.mock('services/sendMail')

describe('testing MailUs', () => {
    it('should render component', () => {
        expect(shallow(<MailUs />)).toMatchSnapshot()
    })

    it('should set Form fieldErrors if mailUsError is a truthy non string value', () => {
        const mockFieldErrors = [{ fieldNameString: 'error msg' }],
            wrapper = shallow(<MailUs mailUsError={mockFieldErrors} />)

        expect(wrapper.find('Form').prop('fieldErrors')).toEqual(mockFieldErrors)
    })
})
