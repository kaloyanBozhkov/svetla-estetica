// import common types
import type { ReactElement } from 'react'
import type { FormErrorType } from 'common/types'

// import atom styles
import styles from './styles.module.scss'

export default function FormError({ error }: { error: FormErrorType }): ReactElement | null {
    return error && typeof error === 'string' ? <p className={styles.errorMsg}>{error}</p> : null
}
