import type { ReactElement } from 'react'
import styles from './workingHours.module.scss'

const hours = [
        ['Lunedì', '09.00 - 20.00'],
        ['Martedì', '09.00 - 20.00'],
        ['Mercoledì', '09.00 - 20.00'],
        ['Giovedì', '09.00 - 20.00'],
        ['Venerdì', '09.00 - 20.00'],
        ['Sabato', '09.00 - 18.00'],
    ],
    WorkingHours = (): ReactElement => (
        <div className={styles.workingHours}>
            {hours.map(([day, hour]) => (
                <div key={day}>
                    <p>{day}</p>
                    <p>
                        {hour.split(' ').map((item) => (
                            <span key={`${day}-${item}`}>{item}</span>
                        ))}
                    </p>
                </div>
            ))}
        </div>
    )

export default WorkingHours
