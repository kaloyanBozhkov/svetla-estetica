import type { ReactElement } from 'react'
import Button from 'components/UI/Button/Button'
import styles from './slide1.module.scss'

const Slide1 = (): ReactElement => (
    <div className={styles.slide1}>
        <div className={styles.infoArea}>
            <div className={styles.message}>
                <p>Svetla Estetica</p>
                <p>
                    <span>il tuo centro estetico</span>
                    <br />
                    <span>a Dalmine</span>
                </p>
            </div>
            <div className={styles.btnWrapper}>
                <Button
                    label="Listino Prezzi"
                    // eslint-disable-next-line
                    onClick={() => (window.location.hash = 'listino')}
                    modifier="hallow"
                />
            </div>
        </div>
        <img src="/assets/images/sliders/lady.png" alt="lady" />
    </div>
)

export default Slide1
