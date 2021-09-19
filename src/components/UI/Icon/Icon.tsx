import type { ReactElement } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// import icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import styles from './styles.module.scss'

const Icon = ({ icon }: { icon: string }): ReactElement => {
    switch (icon) {
        case 'spinner':
            return <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />

        default:
            return <i>Icon not found</i>
    }
}

export default Icon
