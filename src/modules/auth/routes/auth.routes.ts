import { Router } from 'express'
import { AuthHandler } from '../handlers/auth.handler'

export class AuthRoutes {
    public router: Router
    private handler: AuthHandler

    public constructor() {
        this.router = Router()
        this.handler = new AuthHandler()
        this.initRoutes()
    }

    private initRoutes() {
        this.router.post('/signin', this.handler.signin)
        this.router.post('/register', this.handler.register)
    }
}
