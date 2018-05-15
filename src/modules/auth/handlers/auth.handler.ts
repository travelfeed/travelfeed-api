import { v1 as uuidv1 } from 'uuid'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'
import { bind } from 'decko'
import { escape } from 'validator'
import { MailConfig, Mailservice } from '../../../config/mailservice'
import {
    MailParams as regConfirmParams,
    metadata as regConfirmMeta
} from '../templates/register-confirm/config'
import { User } from '../../user/models/user.model'
import { UserRole } from '../../user/models/user.role.model'
import { HelperHandler } from '../../misc/handlers/helper.handler'

export class AuthHandler extends HelperHandler {
    private repository: Repository<User>
    private mailservice: Mailservice

    public constructor() {
        super()
        this.repository = getManager().getRepository(User)
        this.mailservice = new Mailservice()
    }

    @bind
    public async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email = escape(req.body.email || '')

            const user: User = await this.repository.findOne({
                select: ['password', 'id'],
                relations: ['userRole'],
                where: {
                    email: email,
                    active: true
                }
            })

            // user found
            if (user != null && user.id > 0) {
                const validPassword = await this.verifyPassword(
                    escape(req.body.password),
                    user.password
                )

                if (validPassword) {
                    // create jwt
                    const tokens = this.createTokenPair(user.id)

                    res.status(200).json({
                        status: 200,
                        data: {
                            userId: user.id,
                            userRole: user.userRole.role,
                            authToken: tokens.auth,
                            refreshToken: tokens.refresh
                        }
                    })
                } else {
                    res.status(401).json({
                        status: 401,
                        error: 'wrong email or password'
                    })
                }
            } else {
                res.status(401).json({
                    status: 401,
                    error: 'wrong email or password'
                })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async refresh(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { userId, refreshToken } = req.body as any

            if (!this.validRefreshToken(refreshToken, userId)) {
                return res.status(401).json({
                    status: 401,
                    error: 'Not authorized.'
                })
            }

            const tokens = this.createTokenPair(userId)

            return res.status(200).json({
                status: 200,
                data: {
                    authToken: tokens.auth,
                    refreshToken: tokens.refresh
                }
            })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async signout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            req.logout()
            res.status(200).json({ status: 200, data: null })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email = escape(req.body.email)

            const user: User = await this.repository.findOne({
                where: {
                    email: email
                }
            })

            // email is not taken
            if (!user) {
                // create new empty user instance
                const newUser: User = this.repository.create()
                const uuidHash = this.hashString(uuidv1()) // account activation mail

                // set values
                newUser.email = email
                newUser.password = await this.hashPassword(escape(req.body.password))
                newUser.active = false
                newUser.hash = uuidHash

                // create userRole
                newUser.userRole = await getManager()
                    .getRepository(UserRole)
                    .findOne({ where: { role: 'User' } })

                // save new user
                await this.repository.save(newUser)

                // params for html template
                const mailParams: regConfirmParams = {
                    confirmUrl: `https://travelfeed.blog/auth/activate/${uuidHash}`
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    './src/modules/auth/templates/register-confirm/index.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: regConfirmMeta.from,
                    to: newUser.email,
                    subject: regConfirmMeta.subject,
                    html: mailText
                }

                // send mail to user
                await this.mailservice.sendMail(mail)

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: 'user registration link sent'
                })
            } else {
                res.status(401).json({ status: 401, error: 'email is already taken' })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async unregister(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: User = await this.repository.findOneById(req.user.id)

            if (user != null && user.id > 0) {
                await this.repository.delete(user)

                res.status(200).json({ status: 200, data: 'user deleted' })
            } else {
                res.status(404).json({ status: 404, error: 'user not found' })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: User = await this.repository.findOne({
                where: {
                    hash: req.params.uuid || null,
                    active: false
                }
            })

            if (user != null && user.id > 0) {
                user.active = true
                user.hash = null

                await this.repository.save(user)

                res.status(200).json({
                    status: res.statusCode,
                    data: 'user activated'
                })
            } else {
                res.status(404).json({ status: 404, error: 'user not found' })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async activateResend(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: User = await this.repository.findOne({
                where: {
                    email: escape(req.params.email || ''),
                    active: false
                }
            })

            if (user != null && user.id > 0) {
                const uuidHash = this.hashString(uuidv1()) // account activation mail

                // assign new hash to use
                user.hash = uuidHash
                this.repository.save(user)

                // params for html template
                const mailParams: regConfirmParams = {
                    confirmUrl: `https://travelfeed.blog/auth/activate/${uuidHash}`
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    './src/modules/auth/templates/register-confirm/index.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: regConfirmMeta.from,
                    to: user.email,
                    subject: regConfirmMeta.subject,
                    html: mailText
                }

                // send mail to user
                await this.mailservice.sendMail(mail)

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: 'user registration link sent'
                })
            } else {
                res.status(404).json({ status: 404, error: 'user not found' })
            }
        } catch (err) {
            return next(err)
        }
    }
}
