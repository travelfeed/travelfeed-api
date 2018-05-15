import { Handler } from 'express'
import { authenticate } from 'passport'
import { ExtractJwt, StrategyOptions } from 'passport-jwt'
import { Secret, SignOptions, TokenExpiredError } from 'jsonwebtoken'
import { permissions } from '../config/acl'

export interface SignOpt {
    expiresIn: string
    audience: string
    issuer: string
}

// passport stragegy options
export const jwtConfig: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret-api-key-wow',
    audience: 'travelfeed-angular',
    issuer: 'travelfeed-api'
}

// jsonwebtoken signing options
export const signOptions: SignOptions = {
    expiresIn: '10m',
    audience: jwtConfig.audience,
    issuer: jwtConfig.issuer
}

export const saltRounds = 10

/**
 * Middleware for checking if a user is authorized to access the endpoint.
 *
 * @returns {Handler}
 */
export function isAuthorized(): Handler {
    return (req, res, next) => {
        try {
            authenticate('strategy.jwt', { session: false }, (error, user, info) => {
                // general error
                if (error) {
                    return res.status(500).json({
                        status: 500,
                        error: error
                    })
                }

                // token expired
                if (info) {
                    switch (info.message) {
                        case 'No auth token':
                            return res.status(401).json({
                                status: 401,
                                error: 'Not authorized.'
                            })

                        case 'jwt expired':
                            return res.status(403).json({
                                status: 403,
                                error: 'Auth token expired.'
                            })
                    }
                }

                // user not authorized
                if (!user) {
                    return res.status(401).json({
                        status: 401,
                        data: 'user is not authorized'
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
}

export function checkUserRole(path, action): Handler {
    return async (req, res, next) => {
        try {
            const uid = req.user.id
            const access = await permissions.isAllowed(uid, path, action)

            if (!access) {
                return res.status(401).json({
                    status: 401,
                    error: 'missing user rights'
                })
            }

            return next()
        } catch (err) {
            return next(err)
        }
    }
}
