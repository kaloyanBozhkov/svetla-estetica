import React, { useReducer } from 'react'

// import common types
import { MailForm } from '~/common/types'

// import helpers
import sendMail from '~/services/sendMail'
import { validatePhoneNumber, validateEmail } from '~/helpers/validators'
import useTimerToggle from '~/hooks/useTimerToggle'

// import atoms
import Button from '../UI/Button/Button'
import Input from '../UI/Input/Input'

// import styles
import styles from './mailUs.module.scss'

type action = {
    fieldName: string
    fieldValue: string
}

const valueUpdater = (fieldName: string, setInputs: (action: action) => void) => ({
        target: { value: fieldValue },
    }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setInputs({ fieldName, fieldValue }),
    fields: Array<{ label: string; property: keyof MailForm; isValid?: (s: string) => boolean }> = [
        {
            label: 'Nome',
            property: 'name',
        },
        {
            label: 'Cognome',
            property: 'surname',
        },
        {
            label: 'Email',
            property: 'email',
            isValid: validateEmail,
        },
        {
            label: 'Telefono',
            property: 'phone',
            isValid: validatePhoneNumber,
        },
    ]

const MailUs = (): JSX.Element => {
    const [inputs, setInputs] = useReducer(
            (acc: MailForm, action: action) => ({
                ...acc,
                [action.fieldName]: action.fieldValue,
            }),
            {
                name: '',
                surname: '',
                email: '',
                phone: '',
                message: '',
            }
        ),
        [toggle, setToggled] = useTimerToggle({ untoggleAfter: 1 }),
        cantSubmit = !!Object.values(inputs).filter((i) => !i).length

    return (
        <div className={styles.mailUs}>
            <div className={styles.container}>
                {fields.map(({ label, property, isValid }, index) => {
                    const isValidField =
                        !!inputs[property] && (isValid ? isValid(inputs[property]) : true)

                    return (
                        <div
                            key={index}
                            className={styles.inputWrapper}
                            data-is-valid={isValidField}
                            data-is-toggled={toggle}
                        >
                            <Input
                                label={label}
                                value={inputs[property]}
                                onChange={valueUpdater(property, setInputs)}
                            />
                        </div>
                    )
                })}
            </div>
            <div
                className={styles.inputWrapper}
                data-is-valid={!!inputs.message}
                data-is-toggled={toggle}
            >
                <Input
                    label="Messaggio"
                    type="text"
                    value={inputs.message}
                    onChange={valueUpdater('message', setInputs)}
                />
            </div>
            <div className={styles.btnWrapper} data-is-disabled={cantSubmit}>
                <Button
                    modifier="solid"
                    label="Invia"
                    onClick={() => {
                        if (cantSubmit) {
                            // enable showing toggled
                            return !toggle && setToggled()
                        }

                        sendMail(inputs)
                    }}
                />
            </div>
        </div>
    )
}

export default MailUs
