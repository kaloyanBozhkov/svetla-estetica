const sendMail = (mailFormInputs: {
    name: string
    email: string
    surname: string
    phone: string
    message: string
}): Promise<{ success: true }> =>
    fetch('/api/sendMail', {
        method: 'POST',
        body: JSON.stringify(mailFormInputs),
    })
        .then((r) => r.json())
        .catch((err) => {
            /* eslint-disable no-console */
            console.error(err)
            throw Error('Could not send email')
        })

export default sendMail
