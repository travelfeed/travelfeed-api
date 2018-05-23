import { Request, Response, NextFunction } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'

import { User } from '../../user/models/user.model'

export class UserHandler {
    private userRepo: Repository<User> = getManager().getRepository(User)

    @bind
    public async readUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users: Array<User> = await this.userRepo.find({
                relations: [
                    'userRole',
                    'articles',
                    'articles.articleText',
                    'articles.articleText.language',
                    'articles.pictures'
                ]
            })
            res.json({
                status: res.statusCode,
                data: users
            })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async readUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: User = await this.userRepo.findOneById(req.params.userId, {
                relations: [
                    'userRole',
                    'articles',
                    'articles.articleText',
                    'articles.articleText.language',
                    'articles.pictures'
                ]
            })

            res.json({
                status: res.statusCode,
                data: user
            })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async readUserArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userArticles: User = await this.userRepo.findOneById(req.params.userId, {
                relations: [
                    'articles',
                    'articles.articleText',
                    'articles.articleText.language',
                    'articles.pictures'
                ]
            })
            res.json({
                status: res.statusCode,
                data: userArticles
            })
        } catch (err) {
            return next(err)
        }
    }
}
