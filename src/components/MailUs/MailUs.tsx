// import common types
import type { ReactElement } from 'react'
import type { FormErrorType, FormFieldDefinition, FormState } from 'common/types'

// import helpers
import Form from '../Form/Form'

// import atoms
import FormError from '../UI/FormError/FormError'

// import styles
import styles from './mailUs.module.scss'

export type MailUsProps = {
    mailUsError: FormErrorType
    formFieldDefinitions: FormFieldDefinition[]
    isMailUsPending: boolean
    onMailUs: (formState: FormState) => void
    onFormFieldFocused?: (fieldName?: string) => void
}

const MailUs = ({
    mailUsError,
    formFieldDefinitions,
    isMailUsPending,
    onMailUs,
    onFormFieldFocused,
}: MailUsProps): ReactElement => (
    <div className={styles.formWrapper}>
        {/* If error is a simple stirng it is a top level error */}
        <FormError error={mailUsError} />
        <Form
            formId="mailUsForm"
            submitLabel="Invia"
            definitions={formFieldDefinitions}
            fieldErrors={mailUsError && typeof mailUsError !== 'string' ? mailUsError : undefined}
            onSubmit={onMailUs}
            isSubmitPending={isMailUsPending}
            onFormFieldFocused={onFormFieldFocused}
        />
    </div>
)

export default MailUs
