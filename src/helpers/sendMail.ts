import { MailForm } from '~/common/types'

const sendMail = (mailFormInputs: MailForm): void => {
    fetch('/api/sendMail', {
        method: 'POST',
        body: JSON.stringify(mailFormInputs),
    })
        .then((r) => r.json())
        .catch((err) => {
            console.error(err)
            throw Error('Could not send email')
        })
}

export default sendMail
