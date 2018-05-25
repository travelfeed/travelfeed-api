import { Service, Inject } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import {
    JsonController,
    Post,
    Param,
    Req,
    OnUndefined,
    NotFoundError,
    BadRequestError,
} from 'routing-controllers'
import { Request } from 'express'
import { v1 as uuidv1 } from 'uuid'
import { isEmail } from 'validator'
import { Authentication } from '../../services/authentication'
import { User } from '../user/models/user.model'
import { Newsletter } from './models/newsletter.model'
import { MailAction } from '../misc/models/mail.action.model'
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
    @InjectRepository(User) private userRepository: Repository<User>
    @InjectRepository(Newsletter) private newsletterRepository: Repository<Newsletter>
    @InjectRepository(MailAction) private mailActionRepository: Repository<MailAction>

    @Post('/subscribe/:email')
    @OnUndefined(204)
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
                    subLink: `https://travelfeed.blog/newsletter/activate/${uuidHash}`,
                }

                // html template
                const mailText = await this.mail.renderMailTemplate(
                    `./src/modules/newsletter/templates/subscribe.template.html`,
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
                subLink: `https://travelfeed.blog/newsletter/activate/${uuidHash}`,
            }

            // html template
            const mailText = await this.mail.renderMailTemplate(
                `./src/modules/newsletter/templates/subscribe.template.html`,
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
    @OnUndefined(204)
    public async unsubscribe(@Param('uuid') uuid: string) {
        await this.newsletterRepository.delete({
            hash: uuid,
            active: true,
        })
    }

    @Post('/activate/:uuid')
    @OnUndefined(204)
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
    @OnUndefined(201)
    public async send(@Req() req: Request) {
        const author: User = await this.userRepository.findOne(req.user.id)
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
                unsubLink: `https://travelfeed.blog/newsletter/unsubscribe/${uuidHash}`,
            }

            // html template
            const mailText = await this.mail.renderMailTemplate(
                `./src/modules/newsletter/templates/channel.template.html`,
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
        }

        // log mail
        const mailAction: MailAction = await this.mailActionRepository.findOne({
            where: {
                action: 'NewsletterAll',
            },
        })

        await this.mail.logMail(req.path, channelMetadata.subject, author, mailAction)
    }
}
