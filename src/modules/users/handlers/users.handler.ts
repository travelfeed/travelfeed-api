import { Request, Response, NextFunction } from 'express'
import User from '../../users/models/users.model'

class UserHandler {
    public getUsers(req: Request, res: Response, next: NextFunction) {
        res.json({
            status: res.statusCode,
            data: 'Hello user!'
        })
    }

    public getUser(req: Request, res: Response, next: NextFunction) {
        res.json({
            status: res.statusCode,
            data: `Hello user ${req.params.id}`
        })
    }
}

export default new UserHandler()
