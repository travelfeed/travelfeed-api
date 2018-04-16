import { createTransport, Transporter } from 'nodemailer'
import { renderFile } from 'ejs'
import { resolve } from 'path'

const smtpConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rsikh2d6tkdofjkt@ethereal.email',
        pass: 'DyWX135WAEZ3Bx9GDd'
    }
}

export const mailAddresses = {
    blogMail: 'blog@travelfeed.blog',
    supportMail: 'support@travelfeed.blog',
    newsletterMail: 'newsletter@travelfeed.blog'
}

export interface MailConfig {
    from: string
    to: string
    subject: string
    html: string
}

export class Mailservice {
    private transporter: Transporter

    public constructor() {
        this.transporter = createTransport(smtpConfig)
    }

    public async sendMail(options: MailConfig) {
        return this.transporter.sendMail(options)
    }

    public async renderMailTemplate(path: string, options: object) {
        return renderFile(resolve(path), options)
    }
}
