import { Router } from 'express'
import { ArticleHandler } from '../handlers/articles.handler'

export class ArticleRoutes {
    public router: Router

    public constructor(router: Router) {
        this.router = router
        this.initRoutes()
    }

    public initRoutes() {
        const handler = new ArticleHandler()
        this.router.get('/', handler.readArticles.bind(handler))
        this.router.get('/:id', handler.readArticle.bind(handler))
    }
}
