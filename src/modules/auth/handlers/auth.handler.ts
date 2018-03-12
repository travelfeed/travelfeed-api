import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt-nodejs'
import { Request, Response, NextFunction } from 'express'
import { User } from '../../users/models/users.model'
import { jwtConfig, signOpt } from '../../../config/auth'
import { Repository, getManager } from 'typeorm'

export class AuthHandler {
    private repository: Repository<User>

    public constructor() {
        this.repository = getManager().getRepository(User)
    }

    public async signin(req: Request, res: Response, next: NextFunction) {
        try {
            // todo: validation
            const username = req.body.username
            const password = req.body.password

            const user: User = await this.repository.findOne({
                username: username,
                password: password
            })

            // user found
            if (user != null && user.id > 0) {
                console.log(user)

                // create jwt
                const payload = { id: user.id, username: user.username }
                const token = this.generateJwt(payload)

                res
                    .status(res.statusCode)
                    .json({ status: res.statusCode, token: token, data: user })
            } else {
                res.status(401).json({ status: 401, error: 'wrong username or password' })
            }
        } catch (err) {
            next(err)
        }
    }

    public register(req: Request, res: Response, next: NextFunction) {
        const data = {}
        res.json({ status: res.statusCode, data: data })
    }

    private generateJwt(payload) {
        return jwt.sign(payload, jwtConfig['secretOrKey'], signOpt)
    }

    private encodePassword(password) {}

    private comparePassword(plainPassword, hashedPassword) {}
}
