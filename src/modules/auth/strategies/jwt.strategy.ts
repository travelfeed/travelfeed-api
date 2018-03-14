import { Strategy } from 'passport-jwt'
import { Repository, getManager } from 'typeorm'
import { jwtConfig } from '../../../config/auth'
import { User } from '../../user/models/user.model'

export const JwtStrategy = new Strategy(jwtConfig, async (payload, next) => {
    try {
        console.log(`Payload received: ${JSON.stringify(payload)}`)

        const repository: Repository<User> = getManager().getRepository(User)
        const user: User = await repository.findOneById(payload.userId)

        if (user === null) {
            throw new Error('wrong email or password')
        }

        next(null, user)
    } catch (error) {
        next(error)
    }
})
