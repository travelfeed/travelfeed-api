import { Router } from 'express'
import { UserHandler } from '../handlers/users.handler'

export class UserRoutes {
    public router: Router

    public constructor(router: Router) {
        this.router = router
        this.initRoutes()
    }

    public initRoutes() {
        const handler = new UserHandler()
        this.router.get('/', handler.readUsers.bind(handler))
        this.router.get('/:id', handler.readUser.bind(handler))
        this.router.get('/:id/articles', handler.readUserArticles.bind(handler))
    }
}
