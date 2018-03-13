import { Request, Response, NextFunction } from 'express'
import { Article } from '../models/article.model'

import { getManager, Repository } from 'typeorm'

export class ArticleHandler {
    private repository: Repository<Article>

    public constructor() {
        this.repository = getManager().getRepository(Article)
    }

    public async readArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.repository.find({ relations: ['user', 'articleText'] })
            res.json({
                status: res.statusCode,
                data: data == null ? [] : data
            })
        } catch (err) {
            next(err)
        }
    }

    public async readArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.repository.findOneById(req.params.articleId, {
                relations: ['user', 'details', 'details.language', 'pictures']
            })
            res.json({
                status: res.statusCode,
                data: data == null ? [] : data
            })
        } catch (err) {
            next(err)
        }
    }
}
