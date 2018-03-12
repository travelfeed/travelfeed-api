import * as passport from 'passport'
import { Router } from 'express'
import { ArticleHandler } from '../handlers/articles.handler'
import { JwtStrategy } from '../../auth/strategies/jwt.strategy'

export class ArticleRoutes {
    public router: Router
    private handler: ArticleHandler

    public constructor() {
        this.router = Router()
        this.handler = new ArticleHandler()
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get(
            '/',
            passport.authenticate('strategy.jwt', { session: false }),
            this.handler.readArticles.bind(this.handler)
        )
        this.router.get(
            '/:articleId',
            passport.authenticate('strategy.jwt', { session: false }),
            this.handler.readArticle.bind(this.handler)
        )
    }
}
