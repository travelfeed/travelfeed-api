import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { ArticleComment } from '../models/article.comment.model'

export class CommentHandler {
    private repository: Repository<ArticleComment>

    public constructor() {
        this.repository = getManager().getRepository(ArticleComment)
    }

    @bind
    public async readArticleComments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const articleId = req.params.articleId
            const data: Array<ArticleComment> = await this.repository.find({
                where: {
                    article: req.params.articleId
                },
                relations: ['user']
            })
            res.json({ status: res.statusCode, data: data })
        } catch (err) {
            next(err)
        }
    }

    /* ##### CRUD Article ##### */

    @bind
    public async createArticleComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        } catch (err) {
            next(err)
        }
    }

    @bind
    public async readArticleComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const data: ArticleComment = await this.repository.findOneById(req.params.commentId, {
                where: {
                    articleId: req.params.articleId
                },
                relations: ['user']
            })

            res.json({ status: res.statusCode, data: data })
        } catch (err) {
            next(err)
        }
    }

    @bind
    public async updateArticleComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        } catch (err) {
            next(err)
        }
    }

    @bind
    public async deleteArticleComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        } catch (err) {
            next(err)
        }
    }
}
