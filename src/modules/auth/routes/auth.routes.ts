import { Router } from 'express'
import { AuthHandler } from '../handlers/auth.handler'

export class AuthRoutes {
    public router: Router

    constructor(router: Router) {
        this.router = router
        this.initRoutes()
    }

    public initRoutes() {
        const handler = new AuthHandler()
        this.router.get('/signin', handler.signin.bind(handler))
        this.router.get('/register', handler.register.bind(handler))
    }
}
