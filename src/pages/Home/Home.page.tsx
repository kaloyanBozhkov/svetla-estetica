import type { ReactElement } from 'react'

// import components
import Slider from 'components/Slider/Slider'
import Heading from 'components/Heading/Heading'
import GoogleMaps from 'components/GoogleMaps/GoogleMaps'
import WorkingHours from 'components/WorkingHours/WorkingHours'
import Contacts from 'components/Contacts/Contacts'
import MailUs, { MailUsProps } from 'components/MailUs/MailUs'

// import page template
import HomeLayout from 'templates/HomeLayout/BaseLayout'

type HomePageProps = {
    contactEmailSent: boolean
} & MailUsProps

const HomePage = ({
    contactEmailSent,
    mailUsError,
    isMailUsPending,
    formFieldDefinitions,
    onMailUs,
    onFormFieldFocused,
}: HomePageProps): ReactElement => (
    <HomeLayout>
        <Slider />
        <Heading label="Orario Lavorativo" />
        <WorkingHours />
        <Heading label="Contatti" />
        <Contacts />
        <Heading label="Scrivici" />
        {contactEmailSent ? (
            <p>sent successfully</p>
        ) : (
            <MailUs
                mailUsError={mailUsError}
                isMailUsPending={isMailUsPending}
                formFieldDefinitions={formFieldDefinitions}
                onMailUs={onMailUs}
                onFormFieldFocused={onFormFieldFocused}
            />
        )}
        <Heading label="Trovaci su Google Maps" />
        <GoogleMaps />
        <Heading label="Listino Prezzi - Trattamenti" />
    </HomeLayout>
)

export default HomePage
