import type { ReactElement } from 'react'
import styles from './header.module.scss'

const Header = (): ReactElement => (
    <div className={styles.header}>
        <div className={styles.logo}>
            <p>Svetla Estetica</p>
            <a href="#google">Dalmine (BG) - Viale Natale Betelli, 51</a>
        </div>
        <div className={styles.info}>
            <a href="tel:+393935026350">(+39) 393 5026 350</a>
            <p>
                <span>Luv - Ven:</span>
                <span>9.00 - 20.00</span>
            </p>
            <p>
                <span>Sabato:</span>
                <span>9.00 - 18.00</span>
            </p>
        </div>
    </div>
)

export default Header
