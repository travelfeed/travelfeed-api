import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { escape } from 'validator'
import { permissions } from '../../../config/acl'

import { ArticleComment } from '../models/article.comment.model'
import { User } from '../../user/models/user.model'
import { Article } from '../models/article.model'

export class CommentHandler {
    private commentRepo: Repository<ArticleComment> = getManager().getRepository(ArticleComment)
    private userRepo: Repository<User> = getManager().getRepository(User)
    private articleRepo: Repository<Article> = getManager().getRepository(Article)

    @bind
    public async readArticleComments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const articleComments: Array<ArticleComment> = await this.commentRepo.find({
                where: {
                    article: req.params.articleId
                },
                relations: ['user']
            })

            res.json({
                status: res.statusCode,
                data: articleComments
            })
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

            if (article !== undefined && article.id > 0) {
                const date = new Date()
                const now = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

                // create new articleComment instance
                const newArticleComment: ArticleComment = this.commentRepo.create({
                    article: article,
                    text: escape(req.body.text),
                    date: now,
                    user: await this.userRepo.findOneById(req.user.id)
                })

                // save new articleComment
                await this.commentRepo.save(newArticleComment)

                // load new articleComment data
                const data = await this.commentRepo.findOneById(newArticleComment.id, {
                    relations: ['user']
                })

                res.status(201).json({ status: 201, data: newArticleComment })
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
            const articleComment: ArticleComment = await this.commentRepo.findOneById(
                req.params.commentId,
                {
                    where: {
                        articleId: req.params.articleId
                    },
                    relations: ['user']
                }
            )

            res.json({ status: res.statusCode, data: articleComment })
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
                article !== undefined &&
                article.id > 0 &&
                updatedArticleComment !== undefined &&
                updatedArticleComment.id > 0
            ) {
                // updatedArticleComment details
                updatedArticleComment.text = escape(req.body.text)

                // save updatedArticleComment
                this.commentRepo.save(updatedArticleComment)

                res.status(204).send()
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
                article !== undefined &&
                article.id > 0 &&
                deletedArticleComment !== undefined &&
                deletedArticleComment.id > 0
            ) {
                // delete articleComment
                await this.commentRepo.delete(deletedArticleComment)

                res.status(204).send()
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
