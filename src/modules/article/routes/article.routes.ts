import * as passport from 'passport'
import { Router } from 'express'
import { ArticleHandler } from '../handlers/article.handler'

export class ArticleRoutes {
    public router: Router
    private handler: ArticleHandler

    public constructor() {
        this.router = Router()
        this.handler = new ArticleHandler()
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/', this.isAuthorized(), this.handler.readArticles)
        this.router.get('/:articleId', this.isAuthorized(), this.handler.readArticle)
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
