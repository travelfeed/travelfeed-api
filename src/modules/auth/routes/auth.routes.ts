import { Router } from 'express'
import { AuthHandler } from '../handlers/auth.handler'
import { isAuthorized } from '../../../config/auth'

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
        this.router.post('/signout', this.handler.signout)
        this.router.post('/register', this.handler.register)
        this.router.post('/unregister', isAuthorized(), this.handler.unregister)
        this.router.get('/activate/:uuid', this.handler.activate)
        this.router.get('/activateResend/:email', this.handler.activateResend)
    }
}
