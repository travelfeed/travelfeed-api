import { Router } from 'express'
import { ArticleHandler } from '../handlers/article.handler'
import { isAuthorized } from '../../../config/auth'

export class ArticleRoutes {
    public router: Router
    private handler: ArticleHandler

    public constructor() {
        this.router = Router()
        this.handler = new ArticleHandler()
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/', isAuthorized(), this.handler.readArticles)
        this.router.get('/:articleId', isAuthorized(), this.handler.readArticle)
    }
}
