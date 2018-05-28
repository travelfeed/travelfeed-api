import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { createTransport, Transporter } from 'nodemailer'
import { renderFile, Data } from 'ejs'
import { resolve } from 'path'
import { User } from '../modules/user/models/user.model'
import { MailHistory } from '../modules/misc/models/mail.history.model'
import { MailAction } from '../modules/misc/models/mail.action.model'

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
            user: 'rsikh2d6tkdofjkt@ethereal.email',
            pass: 'DyWX135WAEZ3Bx9GDd',
        },
    })

    public constructor(private mailHistoryRepository: Repository<MailHistory>) {}

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

    public async logMail(
        endpoint: string,
        subject: string,
        user: User,
        action: MailAction,
    ): Promise<void> {
        const date = new Date()
        const now = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

        const mailLog = this.mailHistoryRepository.create({
            endpoint: endpoint,
            subject: subject,
            date: now,
            user: user,
            mailAction: action,
        })

        await this.mailHistoryRepository.save(mailLog)
    }
}
