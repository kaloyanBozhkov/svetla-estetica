import styles from './slider.module.scss'

// import slides
import Slide1 from './Slides/Slide1'

const slides = [Slide1]

const Slider = (): JSX.Element => {
    return (
        <div className={styles.slider}>
            {slides.map((Slide, idx) => (
                <Slide key={idx} />
            ))}
        </div>
    )
}

export default Slider
