import styles from './input.module.scss'

type InputProps = {
    type?: 'text' | 'input'
    label: string
    value: string
    onChange: (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => void
}

const Input = ({ type = 'input', label, value, onChange }: InputProps): JSX.Element => {
    return (
        <div className={styles.input} data-is-active={!!value} data-is-textarea={type === 'text'}>
            {type === 'text' ? (
                <textarea id={label} value={value} onChange={onChange} />
            ) : (
                <input id={label} value={value} onChange={onChange} />
            )}
            <label htmlFor={`${label}`}>{label}</label>
        </div>
    )
}

export default Input
