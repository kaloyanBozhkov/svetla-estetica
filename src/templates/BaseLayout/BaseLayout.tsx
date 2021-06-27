import { ReactNode } from 'react'

// import styles
import styles from './baseLayout.module.scss'

const BaseLayout = ({
    header,
    children,
}: {
    header: ReactNode
    children: ReactNode
}): JSX.Element => {
    return (
        <div className={styles.baseLayout}>
            <header>{header}</header>
            <section>{children}</section>
        </div>
    )
}

export default BaseLayout
