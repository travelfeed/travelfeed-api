import { Router } from 'express'
import { UserHandler } from '../handlers/user.handler'
import { isAuthorized, checkUserRole } from '../../../config/auth'

export class UserRoutes {
    public router: Router
    private handler: UserHandler

    public constructor() {
        this.router = Router()
        this.handler = new UserHandler()
        this.initRoutes()
    }

    private initRoutes() {
        this.router.get('/', isAuthorized(), checkUserRole('user', 'read'), this.handler.readUsers)
        this.router.get(
            '/:userId',
            isAuthorized(),
            checkUserRole('user', 'read'),
            this.handler.readUser
        )
        this.router.get(
            '/:userId/article',
            isAuthorized(),
            checkUserRole('user', 'read'),
            this.handler.readUserArticles
        )
    }
}
