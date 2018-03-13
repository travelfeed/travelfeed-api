import { Request, Response, NextFunction } from 'express'
import { User } from '../../user/models/user.model'

import { getManager, Repository } from 'typeorm'

export class UserHandler {
    private repository: Repository<User>

    public constructor() {
        this.repository = getManager().getRepository(User)
    }

    public async readUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.repository.find()
            res.json({
                status: res.statusCode,
                data: data == null ? [] : data
            })
        } catch (err) {
            next(err)
        }
    }

    public async readUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.repository.findOneById(req.params.userId)
            res.json({
                status: res.statusCode,
                data: data == null ? [] : data
            })
        } catch (err) {
            next(err)
        }
    }

    public async readUserArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.repository.findOneById(req.params.userId, {
                relations: ['articles']
            })
            res.json({
                status: res.statusCode,
                data: data == null ? [] : data
            })
        } catch (err) {
            next(err)
        }
    }
}
