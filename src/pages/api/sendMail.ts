// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// import helpers
import smtpMailTo from '~/pages/api/helpers/smtpMailTo'

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method === 'POST') {
        smtpMailTo(JSON.parse(req.body))
            .then((info) => {
                console.log(info)
                res.status(200).json({ success: true })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).send('Error!')
            })
    } else {
        res.status(400).send('Invalid request')
    }
}
