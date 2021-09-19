// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { createSerializer } from 'enzyme-to-json'
import { enableFetchMocks } from 'jest-fetch-mock'

enableFetchMocks()

configure({ adapter: new Adapter() })

// setup enzyme to json so toMatchSnapshot of shallow components will output accordingly
expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }))
