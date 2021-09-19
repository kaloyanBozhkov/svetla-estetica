import type { ReactElement } from 'react'
import styles from './slider.module.scss'

// import slides
import Slide1 from './Slides/Slide1'

const slides = [Slide1],
    Slider = (): ReactElement => (
        <div className={styles.slider}>
            {slides.map((Slide) => (
                <Slide key={Slide.name} />
            ))}
        </div>
    )

export default Slider
