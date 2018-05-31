import { Service } from 'typedi'
import { createTransport, Transporter } from 'nodemailer'
import { renderFile, Data } from 'ejs'
import { resolve } from 'path'

export interface MailConfig {
    from: string
    to: string
    subject: string
    html: string
}

export interface MailMetadata {
    from: string
    subject: string
}

export const mailAddresses = {
    blog: 'blog@travelfeed.blog',
    support: 'support@travelfeed.blog',
    newsletter: 'newsletter@travelfeed.blog',
}

@Service()
export class Mail {
    private transporter: Transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ixf43kwhoxnq4qgr@ethereal.email',
            pass: 'EWQC22a5u8BucTA3WW',
        },
    })

    public sendMail(options: MailConfig) {
        return this.transporter.sendMail(options)
    }

    public renderMailTemplate(path: string, data: Data): Promise<string> {
        return new Promise((success, reject) => {
            renderFile(resolve(path), data, (error, result) => {
                if (error) {
                    reject(error)
                }
                success(result)
            })
        })
    }
}
