// import common types
import type { ReactElement } from 'react'
import type { FormFieldDefinition } from 'common/types'

// import services
import sendMail from 'services/sendMail'

// import page
import HomePage from 'pages/Home/Home.page'

// import form field validator helpers
import {
    isEmailFieldValid,
    isFieldSet,
    isPhoneFieldValid,
} from 'helpers/formFieldValidators.common'

// import hooks
import useService from 'hooks/Data/useService'

export const mailUsFormDefinition = [
    {
        type: 'input',
        name: 'name',
        label: 'Nome',
        required: true,
        validation: isFieldSet,
    },
    {
        type: 'input',
        name: 'surname',
        label: 'Cognome',
        required: true,
        validation: isFieldSet,
    },
    {
        type: 'input',
        name: 'email',
        label: 'Email',
        required: true,
        validation: isEmailFieldValid,
    },
    {
        type: 'input',
        name: 'phone',
        label: 'Telefono',
        required: true,
        validation: isPhoneFieldValid,
    },
    {
        type: 'textarea',
        name: 'message',
        label: 'Messaggio',
        required: true,
        validation: isFieldSet,
    },
] as FormFieldDefinition[]

const HomeContainer = (): ReactElement => {
    const { fireService, completed, isPending, error } =
        useService<Parameters<typeof sendMail>[0]>(sendMail)

    return (
        <HomePage
            contactEmailSent={completed}
            formFieldDefinitions={mailUsFormDefinition}
            mailUsError={error}
            isMailUsPending={isPending}
            onMailUs={(formState) => {
                const formattedData = Object.keys(formState).reduce(
                    (acc, prop) => ({
                        ...acc,
                        [prop]: formState[prop].value,
                    }),
                    {} as Parameters<typeof sendMail>[0]
                )

                fireService(formattedData as Parameters<typeof sendMail>[0])
            }}
        />
    )
}

export default HomeContainer
