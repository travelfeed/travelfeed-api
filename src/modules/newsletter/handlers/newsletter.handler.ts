import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { Newsletter } from '../models/newsletter.model'
import { User } from '../../user/models/user.model'
import { Mailservice, MailConfig } from '../../../config/mailservice'
import { MailParams as newsletterParams, metadata as newsletterMeta } from '../templates/config'
import { runInNewContext } from 'vm'

export class NewsletterHandler {
    private newsletterRepo: Repository<Newsletter>
    private userRepo: Repository<User>
    private mailservice: Mailservice

    public constructor() {
        this.newsletterRepo = getManager().getRepository(Newsletter)
        this.userRepo = getManager().getRepository(User)
        this.mailservice = new Mailservice()
    }

    @bind
    public async subNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: User = await this.userRepo.findOne({
                where: {
                    id: req.user.id,
                    newsletter: false
                }
            })

            if (user != null && user.id > 0) {
                // subscribe to newsletter and save user
                user.newsletter = true
                this.userRepo.save(user)

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: 'subscribed to newsletter'
                })
            } else {
                res.status(404).json({
                    status: 404,
                    error: 'user not found'
                })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async unsubNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: User = await this.userRepo.findOne({
                where: {
                    id: req.user.id,
                    newsletter: true
                }
            })

            if (user != null && user.id > 0) {
                // unsubscribe from newsletter and save user
                user.newsletter = false
                this.userRepo.save(user)

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: 'unsubscribed to newsletter'
                })
            } else {
                res.status(404).json({
                    status: 404,
                    error: 'user not found'
                })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async sendNewsletterAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author: User = await this.userRepo.findOneById(req.user.id)
            const [users, receiversCount] = await this.userRepo.findAndCount({
                where: {
                    active: true,
                    newsletter: true
                }
            })

            // send newsletter to each user
            for (const user of users) {
                const mailParams: newsletterParams = {
                    text: req.body.text
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    './src/modules/newsletter/templates/newsletter.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: newsletterMeta.from,
                    to: user.email,
                    subject: newsletterMeta.subject,
                    html: mailText
                }

                // send mail to user
                await this.mailservice.sendMail(mail)
            }

            // log newsletter
            await this.logNewsletter(req.body.subject, req.body.text, receiversCount, 1, author)

            res.status(res.statusCode).json({
                status: res.statusCode,
                data: 'newsletter sent'
            })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async sendNewsletterSingle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const author: User = await this.userRepo.findOneById(req.user.id)
            const user: User = await this.userRepo.findOne({
                where: {
                    active: true,
                    newsletter: true,
                    email: req.params.email
                }
            })

            if (user != null && user.id > 0) {
                const mailParams: newsletterParams = {
                    text: req.body.text
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    './src/modules/newsletter/templates/newsletter.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: newsletterMeta.from,
                    to: user.email,
                    subject: newsletterMeta.subject,
                    html: mailText
                }

                // send mail to user
                await this.mailservice.sendMail(mail)

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: 'newsletter sent'
                })
            } else {
                res.status(404).json({
                    status: 404,
                    error: 'user not found'
                })
            }

            // log newsletter
            await this.logNewsletter(req.body.subject, req.body.text, 1, 2, author)
        } catch (err) {
            return next(err)
        }
    }

    private async logNewsletter(
        subject: string,
        text: string,
        receivers: number,
        action: number,
        author: User
    ) {
        // create new empty newsletter instance
        const log = this.newsletterRepo.create()

        const date = new Date()
        const now = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

        log.subject = subject
        log.text = text
        log.receivers = receivers
        log.date = now
        log.action = action
        log.user = author

        await this.newsletterRepo.save(log)
    }
}
