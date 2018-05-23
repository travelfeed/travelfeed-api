import { v1 as uuidv1 } from 'uuid'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'
import { bind } from 'decko'
import { escape } from 'validator'

import { MailConfig, Mailservice } from '../../../config/mailservice'
import { registerMetadata } from '../templates/config.template'

import { User } from '../../user/models/user.model'
import { UserRole } from '../../user/models/user.role.model'
import { HelperHandler } from '../../misc/handlers/helper.handler'

export class AuthHandler {
    private userRepo: Repository<User> = getManager().getRepository(User)
    private userRoleRepo: Repository<UserRole> = getManager().getRepository(UserRole)
    private mailservice: Mailservice = new Mailservice()
    private helperHandler: HelperHandler = new HelperHandler()

    @bind
    public async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email = escape(req.body.email || '')

            const user: User = await this.userRepo.findOne({
                select: ['password', 'id'],
                relations: ['userRole'],
                where: {
                    email: email,
                    active: true
                }
            })

            // user found
            if (user !== undefined && user.id > 0) {
                const validPassword = await this.helperHandler.verifyPassword(
                    escape(req.body.password),
                    user.password
                )

                if (validPassword) {
                    // create jwt
                    const tokens = this.helperHandler.createTokenPair(user.id)

                    res.json({
                        status: res.statusCode,
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

            if (!this.helperHandler.validRefreshToken(refreshToken, userId)) {
                return res.status(401).json({ status: 401, error: 'Not authorized.' })
            }

            const tokens = this.helperHandler.createTokenPair(userId)

            return res.json({
                status: res.statusCode,
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

            const user: User = await this.userRepo.findOne({
                where: {
                    email: email
                }
            })

            // email is not taken
            if (!user) {
                // account activation hash
                const uuidHash = this.helperHandler.hashString(uuidv1())

                // create new user instance
                const newUser: User = this.userRepo.create({
                    email: email,
                    password: await this.helperHandler.hashPassword(escape(req.body.password)),
                    active: false,
                    hash: uuidHash,
                    userRole: await this.userRoleRepo.findOne({ where: { role: 'User' } })
                })

                // save new user
                await this.userRepo.save(newUser)

                // params for html template
                const mailParams = {
                    confirmUrl: `https://travelfeed.blog/auth/activate/${uuidHash}`
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    './src/modules/auth/templates/register.template.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: registerMetadata.from,
                    to: newUser.email,
                    subject: registerMetadata.subject,
                    html: mailText
                }

                // send mail to user
                await this.mailservice.sendMail(mail)

                res.status(201).send()
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
            const user: User = await this.userRepo.findOneById(req.user.id)

            if (user !== undefined && user.id > 0) {
                await this.userRepo.delete(user)

                res.status(204).send()
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
            const user: User = await this.userRepo.findOne({
                where: {
                    hash: req.params.uuid || null,
                    active: false
                }
            })

            if (user !== undefined && user.id > 0) {
                user.active = true
                user.hash = null

                await this.userRepo.save(user)

                res.status(204).send()
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
            const user: User = await this.userRepo.findOne({
                where: {
                    email: escape(req.params.email || ''),
                    active: false
                }
            })

            if (user !== undefined && user.id > 0) {
                const uuidHash = this.helperHandler.hashString(uuidv1()) // account activation mail

                // assign new hash to user
                user.hash = uuidHash
                this.userRepo.save(user)

                // params for html template
                const mailParams = {
                    confirmUrl: `https://travelfeed.blog/auth/activate/${uuidHash}`
                }

                // html template
                const mailText = await this.mailservice.renderMailTemplate(
                    './src/modules/auth/templates/register.template.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: registerMetadata.from,
                    to: user.email,
                    subject: registerMetadata.subject,
                    html: mailText
                }

                // send mail to user
                await this.mailservice.sendMail(mail)

                res.status(204).send()
            } else {
                res.status(404).json({ status: 404, error: 'user not found' })
            }
        } catch (err) {
            return next(err)
        }
    }
}
