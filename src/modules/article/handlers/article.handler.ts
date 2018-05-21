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
    private articleRepo: Repository<Article> = getManager().getRepository(Article)
    private userRepo: Repository<User> = getManager().getRepository(User)
    private textRepo: Repository<ArticleText> = getManager().getRepository(ArticleText)
    private langRepo: Repository<Language> = getManager().getRepository(Language)
    private picRepo: Repository<Picture> = getManager().getRepository(Picture)

    public constructor() {}

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
            res.json({
                status: res.statusCode,
                data: data
            })
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
            // create new article instance
            const newArticle: Article = this.articleRepo.create({
                title: escape(req.body.title || ''),
                country: escape(req.body.country || ''),
                city: escape(req.body.city || ''),
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                user: await this.userRepo.findOneById(req.user.id)
            })

            // save new article
            await this.articleRepo.save(newArticle)

            // loop through article texts and store each one
            for (const articleText of req.body.articleText || []) {
                // create new articleText instance
                const newArticleText: ArticleText = this.textRepo.create({
                    article: newArticle,
                    text: escape(articleText.text || ''),
                    language: await this.langRepo.findOneById(articleText.language || 1)
                })

                // save new articleText
                await this.textRepo.save(newArticleText)
            }

            // loop through article pictures and store each one
            for (const articlePic of req.body.pictures || []) {
                // create new empty picture instance
                const newArticlePic: Picture = this.picRepo.create({
                    article: newArticle,
                    link: articlePic.link,
                    title: escape(articlePic.text || ''),
                    alt: escape(articlePic.alt || '')
                })

                // save new picture
                await this.picRepo.save(newArticlePic)
            }

            // load new article data
            const data = await this.articleRepo.findOneById(newArticle.id, {
                relations: ['user', 'articleText', 'articleText.language', 'pictures']
            })

            res.status(201).json({
                status: 201,
                data: data
            })
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

            console.log('==> post article', req.params.articleId, updatedArticle)

            if (updatedArticle !== null && updatedArticle.id > 0) {
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

                res.status(204).send()
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

                res.status(204).send()
            } else {
                res.status(404).json({ status: 404, error: 'article not found' })
            }
        } catch (err) {
            return next(err)
        }
    }
}
