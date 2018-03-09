import { Request, Response, NextFunction } from 'express'
import { Auth } from '../models/auth.model'

export class AuthHandler {
    public signin(req: Request, res: Response, next: NextFunction) {
        const data = new Auth().signin()
        res.json({
            status: res.statusCode,
            data: data
        })
    }

    public register(req: Request, res: Response, next: NextFunction) {
        const data = new Auth().register()
        res.json({
            status: res.statusCode,
            data: data
        })
    }
}
