import { Strategy } from 'passport-jwt'
import { jwtConfig } from '../../../config/auth'
import { User } from '../../users/models/users.model'
import { Repository, getManager } from 'typeorm'

const JwtStrategy = new Strategy(jwtConfig, async (payload, next) => {
    console.log(`Payload received: ${JSON.stringify(payload)}`)

    const repository: Repository<User> = getManager().getRepository(User)
    const user: User = await repository.findOne({ id: payload.id, username: payload.username })

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
