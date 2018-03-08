import { Request, Response, NextFunction } from 'express'
import UserModel from '../../users/models/users.model'

export class UserHandler {
    public async readUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await UserModel.forge().readUsers()
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
            const data = await UserModel.forge().readUser(req.params.id)
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
            const data = await UserModel.forge().readUserArticles(req.params.id)
            res.json({
                status: res.statusCode,
                data: data != null ? data.related('articles') : []
            })
        } catch (err) {
            next(err)
        }
    }
}
