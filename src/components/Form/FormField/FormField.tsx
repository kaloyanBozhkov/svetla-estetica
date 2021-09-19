// import commoon types
import type { ReactElement } from 'react'
import type { FormFieldProps } from 'common/types'

// import atoms
import Input from 'components/UI/Input/Input'

// import styles
import styles from './styles.module.scss'

export default function FormField({
    type,
    label,
    name,
    value,
    modifier,
    required,
    hasErrored,
    description,
    errorMsg,
    onBlur,
    onFocus,
    onChange,
}: FormFieldProps): ReactElement {
    switch (type) {
        // fall-through since text and apssword both use same input setup
        case 'textarea':
        case 'input':
            return (
                <div
                    className={styles.formField}
                    form-field={name}
                    form-type={type}
                    data-has-errored={hasErrored}
                >
                    <Input
                        type={type}
                        name={name}
                        label={label}
                        value={value}
                        modifier={modifier}
                        required={required}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onChange={onChange}
                    />
                    {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
                    {description && <p className={styles.desc}>{description}</p>}
                </div>
            )
        default:
            return <p>type {type} not configured</p>
    }
}
