import Button from 'components/UI/Button/Button'
import styles from './heading.module.scss'

type HeadingProps = {
    label: string
    buttonProps?: {
        label: string
        onClick: () => void
    }
}

const Heading = ({ label, buttonProps }: HeadingProps): JSX.Element => {
    return (
        <div className={styles.heading}>
            <p>{label}</p>
            {buttonProps && (
                <div className={styles.btnWrapper}>
                    <Button {...buttonProps} modifier="solid" />
                </div>
            )}
        </div>
    )
}

export default Heading
