import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { User } from '../../user/models/user.model'

export class UserHandler {
    private repository: Repository<User>

    public constructor() {
        this.repository = getManager().getRepository(User)
    }

    @bind
    public async readUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Array<User> = await this.repository.find({
                relations: [
                    'userRole',
                    'articles',
                    'articles.articleText',
                    'articles.articleText.language',
                    'articles.pictures'
                ]
            })
            res.status(res.statusCode).json({
                status: res.statusCode,
                data: data
            })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async readUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: User = await this.repository.findOneById(req.params.userId, {
                relations: [
                    'userRole',
                    'articles',
                    'articles.articleText',
                    'articles.articleText.language',
                    'articles.pictures'
                ]
            })

            res.status(res.statusCode).json({
                status: res.statusCode,
                data: data
            })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async readUserArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: User = await this.repository.findOneById(req.params.userId, {
                relations: [
                    'articles',
                    'articles.articleText',
                    'articles.articleText.language',
                    'articles.pictures'
                ]
            })
            res.status(res.statusCode).json({
                status: res.statusCode,
                data: data == null ? [] : data
            })
        } catch (err) {
            return next(err)
        }
    }
}
