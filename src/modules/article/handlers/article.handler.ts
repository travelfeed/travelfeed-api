import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { escape } from 'validator'
import { Article } from '../models/article.model'
import { User } from '../../user/models/user.model'
import { ArticleText } from '../models/article.text.model'
import { Language } from '../../misc/models/language.model'
import { Picture } from '../../misc/models/picture.model'

export class ArticleHandler {
    private articleRepo: Repository<Article>
    private userRepo: Repository<User>
    private textRepo: Repository<ArticleText>
    private langRepo: Repository<Language>
    private picRepo: Repository<Picture>

    public constructor() {
        this.articleRepo = getManager().getRepository(Article)
        this.userRepo = getManager().getRepository(User)
        this.textRepo = getManager().getRepository(ArticleText)
        this.langRepo = getManager().getRepository(Language)
        this.picRepo = getManager().getRepository(Picture)
    }

    @bind // read all articles
    public async readArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Array<Article> = await this.articleRepo.find({
                relations: [
                    'user',
                    'articleText',
                    'articleText.language',
                    'pictures',
                    'comments',
                    'comments.user'
                ]
            })
            res.json({ status: res.statusCode, data: data })
        } catch (err) {
            return next(err)
        }
    }

    @bind // read ten newest articles
    public async readNewestArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const data: Array<Article> = await this.articleRepo.find({
                relations: [
                    'user',
                    'articleText',
                    'articleText.language',
                    'pictures',
                    'comments',
                    'comments.user'
                ],
                order: {
                    id: 'DESC'
                },
                take: 10
            })
        } catch (err) {
            return next(err)
        }
    }

    @bind // read ten best rated articles
    public async readBestRatedArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const data: Array<Article> = await this.articleRepo.find({
                relations: [
                    'user',
                    'articleText',
                    'articleText.language',
                    'pictures',
                    'comments',
                    'comments.user'
                ],
                order: {
                    peaces: 'DESC'
                },
                take: 10
            })
        } catch (err) {
            return next(err)
        }
    }

    /* ##### CRUD Article ##### */

    @bind
    public async createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // create new empty article instance
            const newArticle: Article = this.articleRepo.create()

            // article details
            newArticle.title = escape(req.body.title || '')
            newArticle.country = escape(req.body.country || '')
            newArticle.city = escape(req.body.city || '')
            newArticle.latitude = req.body.latitude || ''
            newArticle.longitude = req.body.longitude || ''
            newArticle.user = await this.userRepo.findOneById(req.user.id)

            // save new article
            await this.articleRepo.save(newArticle)

            // loop through article texts and store each one
            for (const articleText of req.body.articleText) {
                // create new empty articleText instance
                const newArticleText: ArticleText = await this.textRepo.create()

                // articleText details
                newArticleText.article = newArticle
                newArticleText.text = escape(articleText.text || '')
                newArticleText.language = await this.langRepo.findOneById(articleText.language || 1)
                newArticleText.article = newArticle

                // save new articleText
                await this.textRepo.save(newArticleText)
            }

            // loop through article pictures and store each one
            for (const articlePic of req.body.pictures) {
                // create new empty picture instance
                const newArticlePic: Picture = await this.picRepo.create()

                // picture details
                newArticlePic.article = newArticle
                newArticlePic.link = articlePic.link || ''
                newArticlePic.title = escape(articlePic.text || '')
                newArticlePic.alt = escape(articlePic.alt || '')

                // save new picture
                await this.picRepo.save(newArticlePic)
            }

            // load new article data
            const data = await this.articleRepo.findOneById(newArticle.id, {
                relations: ['user', 'articleText', 'articleText.language', 'pictures']
            })

            res.status(res.statusCode).json({ status: res.statusCode, data: data })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async readArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Article = await this.articleRepo.findOneById(req.params.articleId, {
                relations: [
                    'user',
                    'articleText',
                    'articleText.language',
                    'pictures',
                    'comments',
                    'comments.user'
                ]
            })

            res.json({ status: res.statusCode, data: data })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // create new article instance
            const updatedArticle: Article = await this.articleRepo.findOneById(req.params.articleId)

            if (updatedArticle != null && updatedArticle.id > 0) {
                // article details
                updatedArticle.title = escape(req.body.title || '')
                updatedArticle.country = escape(req.body.country || '')
                updatedArticle.city = escape(req.body.city || '')
                updatedArticle.latitude = req.body.latitude || ''
                updatedArticle.longitude = req.body.longitude || ''

                // save updated article
                await this.articleRepo.save(updatedArticle)

                /**
                 * TODO: Update articleTexts and pictures
                 */

                // load updated article data
                const data = await this.articleRepo.findOneById(updatedArticle.id, {
                    relations: ['user', 'articleText', 'articleText.language', 'pictures']
                })

                res.status(res.statusCode).json({ status: res.statusCode, data: data })
            } else {
                res.status(404).json({
                    status: 404,
                    error: 'article not found'
                })
            }
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deletedArticle: Article = await this.articleRepo.findOneById(req.params.articleId)

            if (deletedArticle != null && deletedArticle.id > 0) {
                // delete article
                await this.articleRepo.delete(deletedArticle)

                res.status(res.statusCode).json({ status: res.statusCode, data: 'article deleted' })
            } else {
                res.status(404).json({ status: 404, error: 'article not found' })
            }
        } catch (err) {
            return next(err)
        }
    }
}
