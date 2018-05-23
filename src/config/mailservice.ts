import { getManager, Repository } from 'typeorm'
import { createTransport, Transporter } from 'nodemailer'
import { renderFile } from 'ejs'
import { resolve } from 'path'

import { MailHistory } from '../modules/misc/models/mail.history.model'
import { MailAction } from '../modules/misc/models/mail.action.model'
import { User } from '../modules/user/models/user.model'

const smtpConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rsikh2d6tkdofjkt@ethereal.email',
        pass: 'DyWX135WAEZ3Bx9GDd'
    }
}

export const MailAddresses = {
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

export interface MailMetadata {
    from: string
    subject: string
}

export class Mailservice {
    private transporter: Transporter = createTransport(smtpConfig)
    private mailHistoryRepo: Repository<MailHistory> = getManager().getRepository(MailHistory)

    public sendMail(options: MailConfig) {
        return this.transporter.sendMail(options)
    }

    public renderMailTemplate(path: string, options: object) {
        return renderFile(resolve(path), options)
    }

    public async logMail(
        endpoint: string,
        subject: string,
        user: User,
        action: MailAction
    ): Promise<void> {
        const date = new Date()
        const now = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

        const mailLog = this.mailHistoryRepo.create({
            endpoint: endpoint,
            subject: subject,
            date: now,
            user: user,
            mailAction: action
        })

        await this.mailHistoryRepo.save(mailLog)
    }
}
