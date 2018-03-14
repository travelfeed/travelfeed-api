import { Router } from 'express'
import { UserHandler } from '../handlers/user.handler'
import { isAuthorized } from '../../../config/auth'

export class UserRoutes {
    public router: Router
    private handler: UserHandler

    public constructor() {
        this.router = Router()
        this.handler = new UserHandler()
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/', isAuthorized(), this.handler.readUsers)
        this.router.get('/:userId', isAuthorized(), this.handler.readUser)
        this.router.get('/:userId/articles', isAuthorized(), this.handler.readUserArticles)
    }
}
