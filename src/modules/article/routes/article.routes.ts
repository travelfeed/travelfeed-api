import { Router } from 'express'
import { ArticleHandler } from '../handlers/article.handler'
import { CommentHandler } from '../handlers/article.comment.handler'
import { isAuthorized, checkUserRole } from '../../../config/auth'

export class ArticleRoutes {
    public router: Router
    private articleHandler: ArticleHandler
    private commentHandler: CommentHandler

    public constructor() {
        this.router = Router()
        this.articleHandler = new ArticleHandler()
        this.commentHandler = new CommentHandler()

        this.initArticleRoutes()
        this.initCommentRoutes()
    }

    private initArticleRoutes() {
        this.router.get(
            '/',
            isAuthorized(),
            checkUserRole('article', 'read'),
            this.articleHandler.readArticles
        )

        /* ##### Article CRUD ##### */

        this.router.post(
            '/',
            isAuthorized(),
            checkUserRole('article', 'create'),
            this.articleHandler.createArticle
        )
        this.router.get(
            '/:articleId',
            isAuthorized(),
            checkUserRole('article', 'read'),
            this.articleHandler.readArticle
        )
        this.router.put(
            '/:articleId',
            isAuthorized(),
            checkUserRole('article', 'update'),
            this.articleHandler.updateArticle
        )
        this.router.delete(
            '/:articleId',
            isAuthorized(),
            checkUserRole('article', 'delete'),
            this.articleHandler.deleteArticle
        )
    }

    private initCommentRoutes() {
        this.router.get(
            '/:articleId/comment',
            isAuthorized(),
            checkUserRole('comment', 'read'),
            this.commentHandler.readArticleComments
        )

        /* ##### Comment CRUD ##### */

        this.router.post(
            '/:articleId/comment',
            isAuthorized(),
            checkUserRole('comment', 'create'),
            this.commentHandler.createArticleComment
        )
        this.router.get(
            '/:articleId/comment/:commentId',
            isAuthorized(),
            checkUserRole('comment', 'read'),
            this.commentHandler.readArticleComment
        )
        this.router.put(
            '/:articleId/comment/:commentId',
            isAuthorized(),
            checkUserRole('comment', 'update'),
            this.commentHandler.updateArticleComment
        )
        this.router.delete(
            '/:articleId/comment/:commentId',
            isAuthorized(),
            checkUserRole('comment', 'delete'),
            this.commentHandler.deleteArticleComment
        )
    }
}
