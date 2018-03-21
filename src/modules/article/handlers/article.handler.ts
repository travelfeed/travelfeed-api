import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { Article } from '../models/article.model'

export class ArticleHandler {
    private repository: Repository<Article>

    public constructor() {
        this.repository = getManager().getRepository(Article)
    }

    @bind // read all articles
    public async readArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Array<Article> = await this.repository.find({
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
            next(err)
        }
    }

    @bind // read ten newest articles
    public async readNewestArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const data: Array<Article> = await this.repository.find({
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
            next(err)
        }
    }

    @bind // read ten best rated articles
    public async readBestRatedArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const data: Array<Article> = await this.repository.find({
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
            next(err)
        }
    }

    /* ##### CRUD Article ##### */

    @bind
    public async createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // create new empty article instance
            const newArticle: Article = this.repository.create()

            // add further props here
            newArticle.country = req.body.country

            // save new article
            await this.repository.save(newArticle)

            res.json({ status: res.statusCode, data: newArticle })
        } catch (err) {
            next(err)
        }
    }

    @bind
    public async readArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Article = await this.repository.findOneById(req.params.articleId, {
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
            next(err)
        }
    }

    @bind
    public async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const article: Article = await this.repository.findOneById(req.params.articleId, {
                relations: ['user', 'articleText', 'articleText.language', 'pictures']
            })

            // add further props here
            article.title = req.body.title

            // save updated article
            const updatedArticle = await this.repository.save(article)

            res.json({ status: res.statusCode, data: updatedArticle })
        } catch (err) {
            next(err)
        }
    }

    @bind
    public async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const article: Article = await this.repository.findOneById(req.params.articleId)

            // delete article
            await this.repository.delete(article)

            // search for deleted article
            const articleExists = await this.repository.findOneById(req.params.articleId)

            if (!articleExists) {
                res.json({ status: res.statusCode, data: 'article was deleted' })
            } else {
                res.status(500).json({ status: 500, data: 'article was not deleted' })
            }
        } catch (err) {
            next(err)
        }
    }
}
