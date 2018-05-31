import { Service, Inject } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import {
    JsonController,
    Post,
    Param,
    Req,
    NotFoundError,
    BadRequestError,
} from 'routing-controllers'
import { Request } from 'express'
import { v1 as uuidv1 } from 'uuid'
import { isEmail } from 'validator'
import { Authentication, Authorized } from '../../services/authentication'
import { Newsletter } from './models/newsletter.model'
import { Mail, MailConfig } from '../../services/mail'
import { subscribeMetadata, channelMetadata } from './templates/config.template'

@Service()
@JsonController('/newsletter')
export class NewsletterController {
    @Inject() private authentication: Authentication

    @Inject() private mail: Mail

    /**
     * Model repositories
     */
    @InjectRepository(Newsletter) private newsletterRepository: Repository<Newsletter>

    @Post('/subscribe/:email')
    @Authorized('newsletter', 'subscribe')
    public async subscribe(@Param('email') email: string) {
        const subUser: Newsletter = await this.newsletterRepository.findOne({
            where: {
                email: email,
            },
        })

        // check if user already subscribed to newsletter
        if (!subUser) {
            if (isEmail(email || '')) {
                const uuidHash = this.authentication.hashString(uuidv1()) // activation hash

                // create new newsletter instance
                const nlUser: Newsletter = this.newsletterRepository.create({
                    email: email,
                    hash: uuidHash,
                    active: false,
                })

                await this.newsletterRepository.save(nlUser)

                const mailParams = {
                    subLink: `${process.env.DOMAIN}/api/newsletter/activate/${uuidHash}`,
                }

                // html template
                const mailText = await this.mail.renderMailTemplate(
                    `./dist/modules/newsletter/templates/subscribe.template.html`,
                    mailParams,
                )

                const mail: MailConfig = {
                    from: subscribeMetadata.from,
                    to: nlUser.email,
                    subject: subscribeMetadata.subject,
                    html: mailText,
                }

                await this.mail.sendMail(mail)
            } else {
                throw new BadRequestError('Invalid email address')
            }
        } else if (!subUser && subUser.email && !subUser.active) {
            // resend activation link if not active

            const uuidHash = this.authentication.hashString(uuidv1()) // activation hash
            subUser.hash = uuidHash

            await this.newsletterRepository.save(subUser)

            const mailParams = {
                subLink: `${process.env.DOMAIN}/api/newsletter/activate/${uuidHash}`,
            }

            // html template
            const mailText = await this.mail.renderMailTemplate(
                `./dist/modules/newsletter/templates/subscribe.template.html`,
                mailParams,
            )

            const mail: MailConfig = {
                from: subscribeMetadata.from,
                to: subUser.email,
                subject: subscribeMetadata.subject,
                html: mailText,
            }

            await this.mail.sendMail(mail)
        } else {
            throw new BadRequestError('User already subscribed')
        }
    }

    @Post('/unsubscribe/:uuid')
    @Authorized('newsletter', 'unsubscribe')
    public async unsubscribe(@Param('uuid') uuid: string) {
        await this.newsletterRepository.delete({
            hash: uuid,
            active: true,
        })
    }

    @Post('/activate/:uuid')
    public async activate(@Param('uuid') uuid: string) {
        const user: Newsletter = await this.newsletterRepository.findOne({
            where: {
                hash: uuid,
                active: false,
            },
        })

        if (!user || !user.email) {
            throw new NotFoundError('User not found.')
        }

        user.active = true
        user.hash = null

        await this.newsletterRepository.save(user)
    }

    @Post('/send')
    @Authorized('newsletter', 'send')
    public async send(@Req() req: Request) {
        const [users] = await this.newsletterRepository.findAndCount({
            where: {
                active: true,
            },
        })

        // send newsletter to each user
        for (const user of users) {
            const uuidHash = this.authentication.hashString(uuidv1())

            user.hash = uuidHash
            await this.newsletterRepository.save(user)

            const mailParams = {
                text: req.body.text,
                unsubLink: `${process.env.DOMAIN}/api/newsletter/unsubscribe/${uuidHash}`,
            }

            // html template
            const mailText = await this.mail.renderMailTemplate(
                `./dist/modules/newsletter/templates/channel.template.html`,
                mailParams,
            )

            const mail: MailConfig = {
                from: channelMetadata.from,
                to: user.email,
                subject: channelMetadata.subject,
                html: mailText,
            }

            // send mail to user
            await this.mail.sendMail(mail)

            return null
        }
    }
}
