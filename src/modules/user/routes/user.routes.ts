import * as passport from 'passport'
import { Router } from 'express'
import { UserHandler } from '../handlers/user.handler'

export class UserRoutes {
    public router: Router
    private handler: UserHandler

    public constructor() {
        this.router = Router()
        this.handler = new UserHandler()
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/', this.isAuthorized(), this.handler.readUsers)
        this.router.get('/:userId', this.isAuthorized(), this.handler.readUser)
        this.router.get('/:userId/articles', this.isAuthorized(), this.handler.readUserArticles)
    }

    private isAuthorized() {
        return (req, res, next) => {
            passport.authenticate('strategy.jwt', { session: false }, (err, user, info) => {
                if (err || !user) {
                    res.status(401).json({
                        status: 401,
                        data: 'user is not authorized'
                    })
                }

                next()
            })(req, res, next)
        }
    }
}
