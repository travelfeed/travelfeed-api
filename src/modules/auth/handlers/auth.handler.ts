import { Request, Response, NextFunction } from 'express'
import Auth from '../models/auth.model'

export class AuthHandler {
    public signin(req: Request, res: Response, next: NextFunction) {
        res.json({ status: res.statusCode, data: 'Signin!' })
    }

    public register(req: Request, res: Response, next: NextFunction) {
        res.json({ status: res.statusCode, data: 'Register!' })
    }
}
