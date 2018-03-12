import { Request, Response, NextFunction } from 'express'
import { Article } from '../models/articles.model'

import { getManager, Repository } from 'typeorm'

export class ArticleHandler {
    private repository: Repository<Article>

    public constructor() {
        this.repository = getManager().getRepository(Article)
    }

    public async readArticles(req: Request, res: Response, next: NextFunction) {
        const data = await this.repository.find()
        res.json({
            status: res.statusCode,
            data: data == null ? [] : data
        })
    }

    public async readArticle(req: Request, res: Response, next: NextFunction) {
        const data = await this.repository.findOneById(req.params.articleId)
        res.json({
            status: res.statusCode,
            data: data == null ? [] : data
        })
    }
}
