import { ExtractJwt } from 'passport-jwt'

// passport stragegy options
const jwtConfig = new Object()
jwtConfig['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtConfig['secretOrKey'] = 'secret-api-key-wow'
jwtConfig['expiration'] = '1h'
jwtConfig['audience'] = 'travelfeed-angular'
jwtConfig['issuer'] = 'travelfeed-api'

// jsonwebtoken signing options
const signOpt = new Object()
signOpt['expiresIn'] = jwtConfig['expiration']
signOpt['audience'] = jwtConfig['audience']
signOpt['issuer'] = jwtConfig['issuer']

export { jwtConfig, signOpt }
