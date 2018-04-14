import { createTransport, Transporter } from 'nodemailer'
import { renderFile } from 'ejs'
import { resolve } from 'path'

const SmtpConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rsikh2d6tkdofjkt@ethereal.email',
        pass: 'DyWX135WAEZ3Bx9GDd'
    }
}

export const mailAddresses = {
    blogMail: 'blog@travelfeed.com',
    supportMail: 'support@travelfeed.com'
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
        this.transporter = createTransport(SmtpConfig)
    }

    public async sendMail(options: MailConfig) {
        return this.transporter.sendMail(options)
    }

    public async renderMail(path: string, options: object) {
        return renderFile(resolve(path), options)
    }
}
