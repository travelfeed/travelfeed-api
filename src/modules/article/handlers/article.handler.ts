import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { Article } from '../models/article.model'

export class ArticleHandler {
    private repository: Repository<Article>

    public constructor() {
        this.repository = getManager().getRepository(Article)
    }

    @bind
    public async readArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Array<Article> = await this.repository.find({
                relations: ['user', 'articleText', 'articleText.language', 'pictures']
            })
            res.json({
                status: res.statusCode,
                data: data == null ? [] : data
            })
        } catch (err) {
            next(err)
        }
    }

    @bind
    public async readArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Article = await this.repository.findOneById(req.params.articleId, {
                relations: ['user', 'articleText', 'articleText.language', 'pictures']
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
