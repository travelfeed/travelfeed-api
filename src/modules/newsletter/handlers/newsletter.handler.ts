import * as uuidv1 from 'uuid/v1'
import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { escape, isEmail } from 'validator'

import { Mailservice, MailConfig } from '../../../config/mailservice'
import {
    MailParams as nlChannelParams,
    metadata as nlChannelMeta
} from '../templates/newsletter-channel/config'
import {
    MailParams as nlSubParams,
    metadata as nlSubMeta
} from '../templates/newsletter-subscribe/config'

import { Newsletter } from '../models/newsletter.model'
import { User } from '../../user/models/user.model'
import { HelperHandler } from '../../misc/handlers/helper.handler'

export class NewsletterHandler extends HelperHandler {
    private newsletterRepo: Repository<Newsletter>
    private userRepo: Repository<User>
    private mailservice: Mailservice

    public constructor() {
        super()
        this.newsletterRepo = getManager().getRepository(Newsletter)
        this.userRepo = getManager().getRepository(User)
        this.mailservice = new Mailservice()
    }

    @bind
    public async subNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userExists: Newsletter = await this.newsletterRepo.findOne({
                where: {
                    email: req.params.email
                }
            })

            // check if user already subscribed to newsletter
            if (!userExists) {
                if (isEmail(req.params.email || '')) {
                    const uuidHash = this.hashString(uuidv1()) // nl activation mail

                    // create new empty newsletter instance
                    const nlUser: Newsletter = this.newsletterRepo.create()
                    nlUser.email = req.params.email
                    nlUser.hash = uuidHash
                    nlUser.active = false

                    await this.newsletterRepo.save(nlUser)

                    const mailParams: nlSubParams = {
                        subLink: `https://travelfeed.blog/newsletter/activate/${uuidHash}`
                    }

                    // html template
                    const mailText = await this.mailservice.renderMailTemplate(
                        `./src/modules/newsletter/templates/newsletter-subscribe/index.html`,
                        mailParams
                    )

                    const mail: MailConfig = {
                        from: nlSubMeta.from,
                        to: nlUser.email,
                        subject: nlSubMeta.subject,
                        html: mailText
                    }

                    await this.mailservice.sendMail(mail)

                    res.status(res.statusCode).json({
                        status: res.statusCode,
                        data: 'subscribed to newsletter'
                    })
                } else {
                    res.status(400).json({
                        status: 400,
                        error: 'invalid email address'
                    })
                }
            } else {
                res.status(400).json({
                    status: 400,
                    error: 'user already subscribed'
                })
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

            if (nlUser != null && nlUser.id > 0) {
                await this.newsletterRepo.delete(nlUser)

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: 'unsubscribed from newsletter'
                })
            } else {
                res.status(404).json({
                    status: 404,
                    data: 'user not found'
                })
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
                hash: req.params.uuid
            }
        })

        if (nlUser != null && nlUser.id > 0) {
            nlUser.active = true
            nlUser.hash = null

            await this.newsletterRepo.save(nlUser)

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
                const uuidHash = this.hashString(uuidv1()) // account activation mail

                user.hash = uuidHash
                await this.newsletterRepo.save(user)

                const mailParams: nlChannelParams = {
                    text: req.body.text,
                    unsubLink: `https://travelfeed.blog/newsletter/unsubscribe/${uuidHash}`
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    './src/modules/newsletter/templates/newsletter-channel/index.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: nlChannelMeta.from,
                    to: user.email,
                    subject: nlChannelMeta.subject,
                    html: mailText
                }

                // send mail to user
                await this.mailservice.sendMail(mail)
            }

            // TODO: log newsletter
            await this.logMail()

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
            const nlUser: Newsletter = await this.newsletterRepo.findOne({
                where: {
                    email: req.params.email,
                    active: true
                }
            })

            if (nlUser != null && nlUser.id > 0) {
                const uuidHash = this.hashString(uuidv1()) // nl unsubscribe link

                nlUser.hash = uuidHash
                await this.newsletterRepo.save(nlUser)

                const mailParams: nlChannelParams = {
                    text: req.body.text,
                    unsubLink: `https://travelfeed.blog/newsletter/unsubscribe/${uuidHash}`
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    './src/modules/newsletter/templates/newsletter-channel/index.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: nlChannelMeta.from,
                    to: nlUser.email,
                    subject: nlChannelMeta.subject,
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

            // TODO: log newsletter
            await this.logMail()
        } catch (err) {
            return next(err)
        }
    }
}
