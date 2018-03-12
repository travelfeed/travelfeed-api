import { Request, Response, NextFunction } from 'express'
import { User } from '../../users/models/users.model'

export class UserHandler {
    public async readUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await new User().readUsers()
            res.json({
                status: res.statusCode,
                data: data
            })
        } catch (err) {
            next(err)
        }
    }

    public async readUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await new User().readUser(req.params.userId)
            res.json({
                status: res.statusCode,
                data: data
            })
        } catch (err) {
            next(err)
        }
    }

    public async readUserArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await new User().readUserArticles(req.params.userId)
            res.json({
                status: res.statusCode,
                data: data != null ? data.related('articles') : []
            })
        } catch (err) {
            next(err)
        }
    }
}
