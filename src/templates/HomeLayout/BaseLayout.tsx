import type { ReactElement, ReactNode } from 'react'

// import styles
import styles from './homeLayout.module.scss'

const HomeLayout = ({ children }: { children: ReactNode }): ReactElement => (
    <div className={styles.homeLayout}>{children}</div>
)

export default HomeLayout
