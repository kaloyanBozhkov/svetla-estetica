import type { ChangeEvent, ReactElement } from 'react'
import styles from './input.module.scss'

export type InputProps = {
    // TODO setup other input types?
    type?: 'input' | 'textarea'
    name: string
    label: string
    value?: string
    required?: boolean
    description?: string
    modifier?: 'base' | 'baseActive'
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onFocus?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onBlur?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const Input = ({
    type = 'input',
    label,
    value = '',
    onChange,
    onFocus,
    onBlur,
}: InputProps): ReactElement => (
    <div className={styles.input} data-is-active={!!value} data-is-textarea={type === 'textarea'}>
        {type === 'textarea' ? (
            <textarea
                id={label}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        ) : (
            <input id={label} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
        )}
        <label htmlFor={`${label}`}>{label}</label>
    </div>
)

export default Input
