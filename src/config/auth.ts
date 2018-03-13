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
