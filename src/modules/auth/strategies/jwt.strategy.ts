import { Strategy } from 'passport-jwt'
import { Repository, getManager } from 'typeorm'
import { jwtConfig } from '../../../config/auth'
import { User } from '../../user/models/user.model'
import { permissions } from '../../../config/acl'

export const JwtStrategy = new Strategy(jwtConfig, async (payload, next) => {
    try {
        const repository: Repository<User> = getManager().getRepository(User)
        const user: User = await repository.findOneById(payload.userId, {
            select: ['id'],
            relations: ['userRole']
        })

        if (!user) {
            next('wrong email or password', null)
        } else {
            permissions.addUserRoles(user.id, user.userRole.role || 'User')
            return next(null, user)
        }
    } catch (error) {
        return next(error)
    }
})
