import * as bcrypt from 'bcrypt-nodejs'
import * as uuidv1 from 'uuid/v1'
import * as crypto from 'crypto'
import { sign } from 'jsonwebtoken'
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
import { jwtConfig, signOpt, saltRounds } from '../../../config/auth'

export class AuthHandler {
    private repository: Repository<User>

    public constructor() {
        this.repository = getManager().getRepository(User)
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
                    const payload = {
                        userId: user.id
                    }

                    const token = sign(payload, jwtConfig.secretOrKey, signOpt)

                    res.status(res.statusCode).json({
                        status: res.statusCode,
                        data: {
                            userId: user.id,
                            userRole: user.userRole.role,
                            authToken: token
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
    public async signout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            req.logout()
            res.status(200).json({
                status: 200,
                data: null
            })
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

                const mailservice = new Mailservice()

                // params for html template
                const mailParams: regConfirmParams = {
                    confirmUrl: `https://travelfeed.blog/auth/activate/${uuidHash}`
                }

                // html template
                const mailText = await mailservice.renderMailTemplate(
                    './src/modules/auth/templates/register-confirm/register-confirm.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: regConfirmMeta.from,
                    to: newUser.email,
                    subject: regConfirmMeta.subject,
                    html: mailText
                }

                // send mail to user
                await mailservice.sendMail(mail)

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: 'user registered'
                })
            } else {
                res.status(401).json({
                    status: 401,
                    error: 'email is already taken'
                })
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

                const mailservice = new Mailservice()

                // params for html template
                const mailParams: regConfirmParams = {
                    confirmUrl: `https://travelfeed.blog/auth/activate/${uuidHash}`
                }

                // html template
                const mailText = await mailservice.renderMailTemplate(
                    './src/modules/auth/templates/register-confirm/register-confirm.html',
                    mailParams
                )

                const mail: MailConfig = {
                    from: regConfirmMeta.from,
                    to: user.email,
                    subject: regConfirmMeta.subject,
                    html: mailText
                }

                // send mail to user
                await mailservice.sendMail(mail)

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    error: 'email sent'
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

    private hashPassword(plainPassword): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(plainPassword, salt, null, (error, hash) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(hash)
                })
            })
        })
    }

    private verifyPassword(plainPassword, hashedPassword): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    // sha256 algorithm
    private hashString(text: string) {
        return crypto
            .createHash('sha256')
            .update(text)
            .digest('hex')
    }
}
