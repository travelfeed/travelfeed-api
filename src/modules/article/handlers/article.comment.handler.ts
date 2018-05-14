import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { escape } from 'validator'
import { permissions } from '../../../config/acl'
import { ArticleComment } from '../models/article.comment.model'
import { User } from '../../user/models/user.model'
import { Article } from '../models/article.model'

export class CommentHandler {
    private commentRepo: Repository<ArticleComment>
    private userRepo: Repository<User>
    private articleRepo: Repository<Article>

    public constructor() {
        this.commentRepo = getManager().getRepository(ArticleComment)
        this.userRepo = getManager().getRepository(User)
        this.articleRepo = getManager().getRepository(Article)
    }

    @bind
    public async readArticleComments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const data: Array<ArticleComment> = await this.commentRepo.find({
                where: {
                    article: req.params.articleId
                },
                relations: ['user']
            })
            res.status(res.statusCode).json({ status: res.statusCode, data: data })
        } catch (err) {
            return next(err)
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
            const article: Article = await this.articleRepo.findOneById(req.params.articleId)

            if (article != null && article.id > 0) {
                // create new empty articleComment instance
                const newArticleComment: ArticleComment = this.commentRepo.create()

                const date = new Date()
                const now = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

                // articleComment details
                newArticleComment.article = article
                newArticleComment.text = escape(req.body.text || '')
                newArticleComment.date = now
                newArticleComment.user = await this.userRepo.findOneById(req.user.id)

                // save new articleComment
                await this.commentRepo.save(newArticleComment)

                // load new articleComment data
                const data = await this.commentRepo.findOneById(newArticleComment.id, {
                    relations: ['user']
                })

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: data
                })
            } else {
                res.status(404).json({ status: 404, error: 'article not found' })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async readArticleComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const data: ArticleComment = await this.commentRepo.findOneById(req.params.commentId, {
                where: {
                    articleId: req.params.articleId
                },
                relations: ['user']
            })

            res.json({ status: res.statusCode, data: data })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async updateArticleComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const article: Article = await this.articleRepo.findOneById(req.params.articleId)
            let updatedArticleComment: ArticleComment

            if (permissions.hasRole(req.user.id, 'Admin')) {
                updatedArticleComment = await this.commentRepo.findOneById(req.params.commentId)
            } else {
                updatedArticleComment = await this.commentRepo.findOneById(req.params.commentId, {
                    where: {
                        user: await this.userRepo.findOneById(req.user.id)
                    }
                })
            }

            if (
                article != null &&
                article.id > 0 &&
                updatedArticleComment != null &&
                updatedArticleComment.id > 0
            ) {
                // updatedArticleComment details
                updatedArticleComment.text = escape(req.body.text || '')

                // save updatedArticleComment
                this.commentRepo.save(updatedArticleComment)

                // load updated articleComment data
                const data = await this.commentRepo.findOneById(updatedArticleComment.id, {
                    relations: ['user']
                })

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: data
                })
            } else {
                res.status(404).json({
                    status: 404,
                    error: 'article or comment not found'
                })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async deleteArticleComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const article: Article = await this.articleRepo.findOneById(req.params.articleId)
            let deletedArticleComment: ArticleComment

            if (permissions.hasRole(req.user.id, 'Admin')) {
                deletedArticleComment = await this.commentRepo.findOneById(req.params.commentId)
            } else {
                deletedArticleComment = await this.commentRepo.findOneById(req.params.commentId, {
                    where: {
                        user: await this.userRepo.findOneById(req.user.id)
                    }
                })
            }

            if (
                article != null &&
                article.id > 0 &&
                deletedArticleComment != null &&
                deletedArticleComment.id > 0
            ) {
                // delete articleComment
                await this.commentRepo.delete(deletedArticleComment)

                res.status(res.statusCode).json({
                    status: res.statusCode,
                    data: 'comment deleted'
                })
            } else {
                res.status(404).json({
                    status: 404,
                    error: 'article or comment not found'
                })
            }
        } catch (err) {
            return next(err)
        }
    }
}
