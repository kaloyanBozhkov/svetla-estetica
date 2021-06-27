// import components
import Slider from 'components/Slider/Slider'
import Heading from 'components/Heading/Heading'
import GoogleMaps from '~/components/GoogleMaps/GoogleMaps'
import WorkingHours from '~/components/WorkingHours/WorkingHours'
import Contacts from '~/components/Contacts/Contacts'
import MailUs from '~/components/MailUs/MailUs'

const HomePage = (): JSX.Element => {
    return (
        <div>
            <Slider />
            <Heading label="Orario Lavorativo" />
            <WorkingHours />
            <Heading label="Contatti" />
            <Contacts />
            <Heading label="Scrivici" />
            <MailUs />
            <Heading label="Trovaci su Google Maps" />
            <GoogleMaps />
        </div>
    )
}

export default HomePage
