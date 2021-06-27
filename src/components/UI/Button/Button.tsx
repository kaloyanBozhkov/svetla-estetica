import React from 'react'
import styles from './button.module.scss'

type ButtonProps = {
    label: string
    onClick: () => void
    modifier: 'hallow' | 'solid'
    disabled?: boolean
}

const Button = ({ label, onClick, modifier, disabled = false }: ButtonProps): JSX.Element => (
    <button
        className={styles.button}
        onClick={onClick}
        data-modifier={modifier}
        disabled={disabled}
    >
        {label}
    </button>
)

export default Button
