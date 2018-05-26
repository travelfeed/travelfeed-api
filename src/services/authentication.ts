import { Service } from 'typedi'
import { Repository, getManager } from 'typeorm'
import { UseBefore } from 'routing-controllers'
import { Request, Response, NextFunction, Handler } from 'express'
import { authenticate, use } from 'passport'
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { SignOptions, sign } from 'jsonwebtoken'
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt-nodejs'
import * as crypto from 'crypto'
import { permissions } from '../permissions'
import { User } from '../modules/user/models/user.model'

export interface TokenPair {
    auth: string
    refresh: string
}

export interface RefreshCounts {
    [key: number]: number
}

export interface RefreshTokens {
    [key: string]: number
}

export function Authorized(resource?: string, permission?: string) {
    const middlewares = [Authentication.isAuthorized]

    if (resource && permission) {
        middlewares.push(Authentication.checkUserRole(resource, permission))
    }

    return UseBefore(...middlewares)
}

@Service()
export class Authentication {
    private strategyOptions: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secret-api-key-wow',
        audience: 'travelfeed-angular',
        issuer: 'travelfeed-api',
    }

    private signOptions: SignOptions = {
        expiresIn: '10m',
        audience: this.strategyOptions.audience,
        issuer: this.strategyOptions.issuer,
    }

    private saltRounds: number = 10

    private refreshCounts: RefreshCounts = {}
    private refreshTokens: RefreshTokens = {}

    /**
     * Middleware for checking if a user is authorized to access the endpoint.
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {any}
     */
    public static isAuthorized(req: Request, res: Response, next: NextFunction): any {
        try {
            authenticate('jwt', { session: false }, (error, user, info) => {
                // general error
                if (error) {
                    console.log('==> error', error)
                    return res.status(500).json({
                        status: 500,
                        error: error,
                    })
                }

                // token expired
                if (info) {
                    switch (info.message) {
                        case 'No auth token':
                            console.log('==> No auth token')
                            return res.status(401).json({
                                status: 401,
                                error: 'Not authorized.',
                            })

                        case 'jwt expired':
                            console.log('==> jwt expired')
                            return res.status(403).json({
                                status: 403,
                                error: 'Auth token expired.',
                            })
                    }
                }

                // user not authorized
                if (!user) {
                    console.log('==> user is not authorized')
                    return res.status(401).json({
                        status: 401,
                        data: 'user is not authorized',
                    })
                }

                // success - store user in req scope
                req.user = user

                return next()
            })(req, res, next)
        } catch (err) {
            return next(err)
        }
    }

    public static checkUserRole(resource, permission): Handler {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const uid = req.user.id
                const access = await permissions.isAllowed(uid, resource, permission)

                if (!access) {
                    return res.status(401).json({
                        status: 401,
                        error: 'missing user rights',
                    })
                }

                return next()
            } catch (err) {
                return next(err)
            }
        }
    }

    public prepare() {
        use('jwt', new Strategy(this.strategyOptions, this.verify))
    }

    public hashPassword(plainPassword): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(this.saltRounds, (err, salt) => {
                if (err) {
                    reject(err)
                }

                bcrypt.hash(plainPassword, salt, null, (error, hash) => {
                    if (error) {
                        reject(error)
                    }

                    resolve(hash)
                })
            })
        })
    }

    public verifyPassword(plainPassword, hashedPassword): Promise<boolean> {
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
    public hashString(text: string) {
        return crypto
            .createHash('sha256')
            .update(text)
            .digest('hex')
    }

    public createTokenPair(userId: number): TokenPair {
        const payload = { userId: userId }
        const auth = sign(payload, this.strategyOptions.secretOrKey, this.signOptions)
        const refresh = `${uuidv1()}-${uuidv4()}`

        // store new refresh token and increase count
        this.refreshCounts[userId] = (this.refreshCounts[userId] || 0) + 1
        this.refreshTokens[refresh] = userId

        return { auth, refresh }
    }

    public validRefreshToken(refreshToken: string, userId: number): boolean {
        // only allow refresh 3 times
        if (this.refreshCounts[userId] > 3) {
            delete this.refreshCounts[userId]
            return false
        }

        // check if refresh token is valid
        if (this.refreshTokens[refreshToken] && this.refreshTokens[refreshToken] === userId) {
            delete this.refreshTokens[refreshToken]
            return true
        }

        return false
    }

    private async verify(payload, next): Promise<void> {
        try {
            const userRepository: Repository<User> = getManager().getRepository(User)
            const user: User = await userRepository.findOne(payload.userEmail, {
                relations: ['role'],
            })

            if (!user) {
                return next('user is not authorized', null)
            }

            permissions.addUserRoles(user.email, user.role.name || 'guest')

            return next(null, user)
        } catch (error) {
            return next(error)
        }
    }
}
