import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt-nodejs'
import { Request, Response, NextFunction } from 'express'
import { Auth } from '../models/auth.model'
import { jwtConfig, signOpt } from '../../../config/auth'

export class AuthHandler {
    public async signin(req: Request, res: Response, next: NextFunction) {
        try {
            // todo: validation
            const username = req.body.username
            const password = req.body.password

            const user = await new Auth().readAuthLoginUser(username, password)

            // user found
            if (user != null && user.get('id') > 0) {
                console.log(user)

                // create jwt
                const payload = { id: user.get('id'), username: user.get('username') }
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
        const data = new Auth().register()
        res.json({ status: res.statusCode, data: data })
    }

    private generateJwt(payload) {
        return jwt.sign(payload, jwtConfig['secretOrKey'], signOpt)
    }

    private encodePassword(password) {}

    private comparePassword(plainPassword, hashedPassword) {}
}
