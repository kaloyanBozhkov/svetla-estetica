import type { ReactElement } from 'react'
import styles from './contacts.module.scss'

const phones = [
        ['Cellulare', '(+39)', '393 5026 350'],
        ['Fisso', '(+39)', '35 0632279'],
    ],
    social = [
        {
            label: 'Svetla Estetica Dalmine',
            className: styles.fb,
            link: 'https://www.facebook.com/SvetlaEsteticaDalmine',
        },
        {
            label: '@svetlaesteticadalmine',
            className: styles.ig,
            link: 'https://www.instagram.com/svetlaesteticadalmine/',
        },
        {
            label: '(+39) 393 5026 350',
            className: styles.ws,
            link: 'https://wa.me/+393935026350',
        },
    ],
    Contacts = (): ReactElement => (
        <div className={styles.contacts}>
            <div>
                {/* <p>Telefono</p> */}
                {phones.map(([type, ext, number]) => (
                    <p key={type}>
                        <span>{type}</span>
                        <a href={`tel:${`${ext} ${number}`.replace(/[(,), ]/g, '')}`}>
                            <span>{ext}</span>
                            <span>{number}</span>
                        </a>
                    </p>
                ))}
            </div>
            <div>
                {social.map(({ className, label, link }) => (
                    <a key={className} href={link}>
                        <div className={className}>
                            <p>{label}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )

export default Contacts
