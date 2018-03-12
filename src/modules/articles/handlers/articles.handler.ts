import { Request, Response, NextFunction } from 'express'
import { Article } from '../models/articles.model'

export class ArticleHandler {
    public async readArticles(req: Request, res: Response, next: NextFunction) {
        const data = await new Article().readArticles()
        res.json({
            status: res.statusCode,
            data: data
        })
    }

    public async readArticle(req: Request, res: Response, next: NextFunction) {
        const data = await new Article().readArticle(req.params.articleId)
        res.json({
            status: res.statusCode,
            data: data
        })
    }
}
