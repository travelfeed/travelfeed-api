import * as uuidv1 from 'uuid/v1'
import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { escape, isEmail } from 'validator'

import { Mailservice, MailConfig } from '../../../config/mailservice'
import { channelMetadata, subscribeMetadata } from '../templates/config.template'

import { Newsletter } from '../models/newsletter.model'
import { User } from '../../user/models/user.model'
import { HelperHandler } from '../../misc/handlers/helper.handler'
import { MailAction } from '../../misc/models/mail.action.model'

export class NewsletterHandler {
    private newsletterRepo: Repository<Newsletter> = getManager().getRepository(Newsletter)
    private userRepo: Repository<User> = getManager().getRepository(User)
    private mailActionRepo: Repository<MailAction> = getManager().getRepository(MailAction)
    private mailservice: Mailservice = new Mailservice()
    private helperHandler: HelperHandler = new HelperHandler()

    @bind
    public async subNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const subUser: Newsletter = await this.newsletterRepo.findOne({
                where: {
                    email: req.params.email
                }
            })

            // check if user already subscribed to newsletter
            if (!subUser) {
                if (isEmail(req.params.email || '')) {
                    const uuidHash = this.helperHandler.hashString(uuidv1()) // activation hash

                    // create new newsletter instance
                    const nlUser: Newsletter = this.newsletterRepo.create({
                        email: req.params.email,
                        hash: uuidHash,
                        active: false
                    })

                    await this.newsletterRepo.save(nlUser)

                    const mailParams = {
                        subLink: `https://travelfeed.blog/newsletter/activate/${uuidHash}`
                    }

                    // html template
                    const mailText = await this.mailservice.renderMailTemplate(
                        `./src/modules/newsletter/templates/subscribe.template.html`,
                        mailParams
                    )

                    const mail: MailConfig = {
                        from: subscribeMetadata.from,
                        to: nlUser.email,
                        subject: subscribeMetadata.subject,
                        html: mailText
                    }

                    await this.mailservice.sendMail(mail)

                    res.status(204).send()
                } else {
                    res.status(400).json({
                        status: 400,
                        error: 'invalid email address'
                    })
                }
            } else if (subUser !== undefined && subUser.id > 0 && !subUser.active) {
                // resend activation link if not active

                const uuidHash = this.helperHandler.hashString(uuidv1()) // activation hash
                subUser.hash = uuidHash

                await this.newsletterRepo.save(subUser)

                const mailParams = {
                    subLink: `https://travelfeed.blog/newsletter/activate/${uuidHash}`
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    `./src/modules/newsletter/templates/subscribe.template.html`,
                    mailParams
                )

                const mail: MailConfig = {
                    from: subscribeMetadata.from,
                    to: subUser.email,
                    subject: subscribeMetadata.subject,
                    html: mailText
                }

                await this.mailservice.sendMail(mail)

                res.status(204).send()
            } else {
                res.status(400).json({ status: 400, error: 'user already subscribed' })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async unsubNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const nlUser: Newsletter = await this.newsletterRepo.findOne({
                where: {
                    hash: escape(req.params.uuid || ''),
                    active: true
                }
            })

            if (nlUser !== undefined && nlUser.id > 0) {
                await this.newsletterRepo.delete(nlUser)

                res.status(204).send()
            } else {
                res.status(404).json({ status: 404, error: 'user not found' })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async activateNewsletter(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const nlUser: Newsletter = await this.newsletterRepo.findOne({
            where: {
                hash: req.params.uuid,
                active: false
            }
        })

        if (nlUser !== undefined && nlUser.id > 0) {
            nlUser.active = true
            nlUser.hash = null

            await this.newsletterRepo.save(nlUser)

            res.status(204).send()
        } else {
            res.status(404).json({ status: 404, error: 'user not found' })
        }
    }

    @bind
    public async sendNewsletterAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author: User = await this.userRepo.findOneById(req.user.id)
            const [users, receiversCount] = await this.newsletterRepo.findAndCount({
                where: {
                    active: true
                }
            })

            // send newsletter to each user
            for (const user of users) {
                const uuidHash = this.helperHandler.hashString(uuidv1()) // account activation mail

                user.hash = uuidHash
                await this.newsletterRepo.save(user)

                const mailParams = {
                    text: req.body.text,
                    unsubLink: `https://travelfeed.blog/newsletter/unsubscribe/${uuidHash}`
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    `./src/modules/newsletter/templates/channel.template.html`,
                    mailParams
                )

                const mail: MailConfig = {
                    from: channelMetadata.from,
                    to: user.email,
                    subject: channelMetadata.subject,
                    html: mailText
                }

                // send mail to user
                await this.mailservice.sendMail(mail)
            }

            // log mail
            const mailAction: MailAction = await this.mailActionRepo.findOne({
                where: {
                    action: 'NewsletterAll'
                }
            })

            await this.mailservice.logMail(req.path, channelMetadata.subject, author, mailAction)

            res.status(204).send()
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
            const nlUser: Newsletter = await this.newsletterRepo.findOne({
                where: {
                    email: req.params.email,
                    active: true
                }
            })

            if (nlUser !== undefined && nlUser.id > 0) {
                const uuidHash = this.helperHandler.hashString(uuidv1()) // nl unsubscribe link

                nlUser.hash = uuidHash
                await this.newsletterRepo.save(nlUser)

                const mailParams = {
                    text: req.body.text,
                    unsubLink: `https://travelfeed.blog/newsletter/unsubscribe/${uuidHash}`
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    `./src/modules/newsletter/templates/channel.template.html`,
                    mailParams
                )

                const mail: MailConfig = {
                    from: channelMetadata.from,
                    to: nlUser.email,
                    subject: channelMetadata.subject,
                    html: mailText
                }

                // send mail to user
                await this.mailservice.sendMail(mail)

                // log mail
                const mailAction: MailAction = await this.mailActionRepo.findOne({
                    where: {
                        action: 'NewsletterSingle'
                    }
                })
                await this.mailservice.logMail(
                    req.path,
                    channelMetadata.subject,
                    author,
                    mailAction
                )

                res.status(204).send()
            } else {
                res.status(404).json({ status: 404, error: 'user not found' })
            }
        } catch (err) {
            return next(err)
        }
    }
}
