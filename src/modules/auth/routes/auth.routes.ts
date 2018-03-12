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

    public initRoutes() {
        this.router.post('/signin', this.handler.signin.bind(this.handler))
        this.router.post('/register', this.handler.register.bind(this.handler))
    }
}
