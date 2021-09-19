import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import styles from './button.module.scss'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    label: ReactNode
    modifier?: 'hallow' | 'solid' | 'denied'
    disabled?: boolean
}

const Button = ({
    label,
    onClick,
    modifier = 'solid',
    disabled = false,
    type = 'button',
}: ButtonProps): ReactElement => (
    <button
        className={styles.button}
        onClick={onClick}
        data-modifier={modifier}
        disabled={disabled}
        // eslint-disable-next-line
        type={type}
    >
        {label}
    </button>
)

export default Button
