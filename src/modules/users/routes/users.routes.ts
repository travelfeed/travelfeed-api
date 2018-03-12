import { Router } from 'express'
import { UserHandler } from '../handlers/users.handler'

export class UserRoutes {
    public router: Router
    private handler: UserHandler

    public constructor() {
        this.router = Router()
        this.handler = new UserHandler()
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/', this.handler.readUsers.bind(this.handler))
        this.router.get('/:userId', this.handler.readUser.bind(this.handler))
        this.router.get('/:userId/articles', this.handler.readUserArticles.bind(this.handler))
    }
}
