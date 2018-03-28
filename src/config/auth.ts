import * as passport from 'passport'
import { permissions } from '../config/acl'
import { ExtractJwt, StrategyOptions } from 'passport-jwt'
import { Secret } from 'jsonwebtoken'

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
export const signOpt: SignOpt = {
    expiresIn: '1h',
    audience: jwtConfig.audience,
    issuer: jwtConfig.issuer
}

export const saltRounds = 10

/**
 * Middleware for checking if a user is authorized to access the endpoint.
 *
 * @returns {Function}
 */
export function isAuthorized() {
    return (req, res, next) => {
        try {
            passport.authenticate('strategy.jwt', { session: false }, (err, user, info) => {
                if (err || !user) {
                    res.status(401).json({ status: 401, data: 'user is not authorized' })
                } else {
                    req.user = user // store user in req scope
                    return next()
                }
            })(req, res, next)
        } catch (err) {
            return next(err)
        }
    }
}

export function checkUserRole(path, action) {
    return async (req, res, next) => {
        try {
            const uid = req.user.id
            const access = await permissions.isAllowed(uid, path, action)

            if (!access) {
                res.status(401).json({ status: 401, error: 'user is not authorized' })
            } else {
                return next()
            }
        } catch (err) {
            return next(err)
        }
    }
}
