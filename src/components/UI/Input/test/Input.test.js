import { shallow } from 'enzyme'
import Input from '../Input'

describe('testing Input atom', () => {
    it('should render atom', () => {
        expect(shallow(<Input value="" label="name" onChange={jest.fn()} />)).toMatchSnapshot()
    })
    it('should run onChange fn', () => {
        const mockOnChange = jest.fn(),
            wrapper = shallow(<Input value="" label="name" onChange={mockOnChange} />)
        wrapper.find('input').prop('onChange')()
        expect(mockOnChange).toHaveBeenCalled()
    })

    it('should render with additional modifier attribute if value set', () => {
        const wrapper = shallow(<Input value="some value" label="name" onChange={jest.fn()} />)
        expect(wrapper.prop('data-is-active')).toBe(true)
    })

    it('should render with textarea', () => {
        const wrapper = shallow(
            <Input type="textarea" value="" label="text" onChange={jest.fn()} />
        )
        expect(wrapper.find('textarea').length).toBe(1)
    })
})
