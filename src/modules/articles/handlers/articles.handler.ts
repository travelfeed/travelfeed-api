import { Request, Response, NextFunction } from 'express'
import ArticleModel from '../models/articles.model'

export class ArticleHandler {
    public async readArticles(req: Request, res: Response, next: NextFunction) {
        const data = await ArticleModel.forge().readArticles()
        res.json({
            status: res.statusCode,
            data: data
        })
    }

    public async readArticle(req: Request, res: Response, next: NextFunction) {
        const data = await ArticleModel.forge().readArticle(req.params.id)
        res.json({
            status: res.statusCode,
            data: data
        })
    }
}
