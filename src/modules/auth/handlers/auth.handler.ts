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
    public async signin(req: Request, res: Response, next: NextFunction) {
        try {
            // todo: validation
            const username = req.body.username
            const password = req.body.password

            const user: User = await this.repository.findOne({
                select: ['username', 'id'],
                where: {
                    username: username,
                    password: password
                }
            })

            // user found
            if (user != null && user.id > 0) {
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
        } catch (err) {
            next(err)
        }
    }

    @bind
    public register(req: Request, res: Response, next: NextFunction) {
        const data = {}
        res.json({
            status: res.statusCode,
            data: data
        })
    }

    private encodePassword(plainPassword) {
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

    private comparePassword(plainPassword, hashedPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
}
