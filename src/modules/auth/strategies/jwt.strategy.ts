import { Strategy } from 'passport-jwt'
import { jwtConfig } from '../../../config/auth'
import { Auth } from '../models/auth.model'

const JwtStrategy = new Strategy(jwtConfig, (payload, next) => {
    console.log(`Payload received: ${JSON.stringify(payload)}`)

    const user = new Auth().readAuthPayloadUser(payload.id, payload.username)

    if (user != null) {
        next(null, user)
    } else {
        next({ error: 'wrong email or password' }, null)
    }

    try {
    } catch (err) {
        next(err, null)
    }
})

export { JwtStrategy }
