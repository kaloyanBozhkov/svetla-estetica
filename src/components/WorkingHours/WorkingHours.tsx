import styles from './workingHours.module.scss'

const hours = [
        ['Lunedì', '09.00 - 20.00'],
        ['Martedì', '09.00 - 20.00'],
        ['Mercoledì', '09.00 - 20.00'],
        ['Giovedì', '09.00 - 20.00'],
        ['Venerdì', '09.00 - 20.00'],
        ['Sabato', '09.00 - 18.00'],
    ],
    WorkingHours = (): JSX.Element => (
        <div className={styles.workingHours}>
            {hours.map(([day, hour]) => (
                <p key={day}>
                    <span>{day}</span>
                    <span>{hour}</span>
                </p>
            ))}
        </div>
    )

export default WorkingHours
