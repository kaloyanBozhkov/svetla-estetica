import type { ReactElement } from 'react'
import styles from './googleMaps.module.scss'

const GoogleMaps = (): ReactElement => (
    <iframe
        className={styles.googleMapsWrapper}
        title="Google Maps - Svetla Estetica Dalmine"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d493.0138478039089!2d9.602949872562638!3d45.6526797088034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4781520a049a6ae5%3A0xc3a83e5635025f72!2sSvetla+Estetica!5e0!3m2!1sen!2sus!4v1494076022105"
        frameBorder="0"
    />
)

export default GoogleMaps
