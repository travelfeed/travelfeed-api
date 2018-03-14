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
    public async readUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.repository.find()
            res.json({
                status: res.statusCode,
                data: data == null ? [] : data
            })
        } catch (err) {
            next(err)
        }
    }

    @bind
    public async readUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.repository.findOneById(req.params.userId)

            res.json({
                status: res.statusCode,
                data: {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    articles: data.articles
                }
            })
        } catch (err) {
            next(err)
        }
    }

    @bind
    public async readUserArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.repository.findOneById(req.params.userId, {
                relations: [
                    'articles',
                    'articles.details',
                    'articles.details.language',
                    'articles.pictures'
                ]
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
