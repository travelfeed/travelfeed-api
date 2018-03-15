import { sign } from 'jsonwebtoken'
import * as bcrypt from 'bcrypt-nodejs'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'
import { bind } from 'decko'
import { User } from '../../user/models/user.model'
import { jwtConfig, signOpt, saltRounds } from '../../../config/auth'

export class AuthHandler {
    private repository: Repository<User>

    public constructor() {
        this.repository = getManager().getRepository(User)
    }

    @bind
    public async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // todo: validation
            const username = req.body.username
            const password = req.body.password

            const user: User = await this.repository.findOne({
                select: ['username', 'password', 'id'],
                where: {
                    username: username
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
                            authToken: token
                        }
                    })
                } else {
                    res.status(401).json({
                        status: 401,
                        error: 'wrong username or password'
                    })
                }
            } else {
                res.status(401).json({
                    status: 401,
                    error: 'wrong username or password'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    @bind
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: await this.encodePassword(req.body.password)
        }

        // save user and signin
        await this.repository.save(user)
        this.signin(req, res, next)
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
