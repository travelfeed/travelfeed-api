import { Request, Response, NextFunction } from 'express'
import AuthModel from '../models/auth.model'

export class AuthHandler {
    public signin(req: Request, res: Response, next: NextFunction) {
        const data = AuthModel.forge().signin()
        res.json({
            status: res.statusCode,
            data: data
        })
    }

    public register(req: Request, res: Response, next: NextFunction) {
        const data = AuthModel.forge().register()
        res.json({
            status: res.statusCode,
            data: data
        })
    }
}
