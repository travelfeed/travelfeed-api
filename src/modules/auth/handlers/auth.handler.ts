import * as bcrypt from 'bcrypt-nodejs'
import { sign } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'
import { bind } from 'decko'
import { User } from '../../user/models/user.model'
import { jwtConfig, signOpt, saltRounds } from '../../../config/auth'
import { UserRole } from '../../user/models/user.role.model'

export class AuthHandler {
    private repository: Repository<User>

    public constructor() {
        this.repository = getManager().getRepository(User)
    }

    @bind
    public async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // todo: validation
            const email = req.body.email
            const password = req.body.password

            const user: User = await this.repository.findOne({
                select: ['password', 'id'],
                relations: ['userRole'],
                where: {
                    email: email
                }
            })

            // user found
            if (user != null && user.id > 0) {
                const validPassword = await this.comparePassword(password, user.password)

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
            next(err)
        }
    }

    @bind
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email = req.body.email

            const user: User = await this.repository.findOne({
                where: {
                    email: email
                }
            })

            // email is not taken
            if (!user) {
                // create new empty user instance
                const newUser: User = this.repository.create()

                // set values
                newUser.email = req.body.email
                newUser.password = await this.encodePassword(req.body.password)

                // create userRole
                newUser.userRole = await getManager()
                    .getRepository(UserRole)
                    .findOne({
                        where: {
                            role: 'User'
                        }
                    })

                // save new user
                await this.repository.save(newUser)

                // signin user
                this.signin(req, res, next)
            } else {
                res.status(401).json({
                    status: 401,
                    error: 'email is already taken'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    private encodePassword(plainPassword): Promise<string> {
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

    private comparePassword(plainPassword, hashedPassword): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }
}
