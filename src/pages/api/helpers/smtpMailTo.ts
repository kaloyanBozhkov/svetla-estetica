import nodemailer from 'nodemailer'
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport'
import { MailForm } from '~/common/types'

const smtpMailTo = (mailFormInputs: MailForm): Promise<Error | SentMessageInfo> => {
    const transporter = nodemailer.createTransport({
            host: 'svetlaestetica.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.REACT_APP_MAIL_EMAIL,
                pass: process.env.REACT_APP_MAIL_PASS,
            },
        }),
        mailOptions = {
            from: process.env.REACT_APP_MAIL_EMAIL,
            to: mailFormInputs.email,
            subject: `Nuovo Messaggio da: ${mailFormInputs.email}`,
            text: `Identità: ${mailFormInputs.name} ${mailFormInputs.surname}\n\n
            Telefono: ${mailFormInputs.phone}\n\n
            Messaggion:\n\n
            ${mailFormInputs.message}`,
        }

    return new Promise((res, rej) =>
        transporter.sendMail(mailOptions, (error, info) => (error ? rej(error) : res(info)))
    )
}

export default smtpMailTo
