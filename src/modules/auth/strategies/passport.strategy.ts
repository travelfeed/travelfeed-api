import { Strategy } from 'passport-jwt'
import { Repository, getManager } from 'typeorm'

import { jwtConfig } from '../../../config/auth'
import { permissions } from '../../../config/acl'

import { User } from '../../user/models/user.model'

export class PassportStrategy {
    public jwt: Strategy
    private userRepo: Repository<User>

    public constructor() {
        this.userRepo = getManager().getRepository(User)
        this.initStrategies()
    }

    private initStrategies() {
        this.jwt = new Strategy(jwtConfig, async (payload, next) => {
            try {
                const user: User = await this.userRepo.findOneById(payload.userId, {
                    select: ['id'],
                    relations: ['userRole']
                })

                if (!user) {
                    return next('user is not authorized', null)
                } else {
                    permissions.addUserRoles(user.id, user.userRole.role || 'User')
                    return next(null, user)
                }
            } catch (err) {
                return next(err)
            }
        })
    }
}
