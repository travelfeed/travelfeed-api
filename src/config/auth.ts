import * as passport from 'passport'
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

/**
 * Middleware for checking if a user is authorized to access the endpoint.
 *
 * @returns {Function}
 */
export function isAuthorized() {
    return (req, res, next) => {
        passport.authenticate('strategy.jwt', { session: false }, (err, user, info) => {
            if (err || !user) {
                res.status(401).json({ status: 401, data: 'user is not authorized' })
            }

            next()
        })(req, res, next)
    }
}
