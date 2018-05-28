import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { JsonController, Get, Post, Delete, Param, Body, CurrentUser } from 'routing-controllers'
import { Authorized } from '../../services/authentication'
import { Article } from './models/article.model'
import { User } from '../user/models/user.model'

@Service()
@JsonController('/article')
export class ArticleController {
    public constructor(private articleRepository: Repository<Article>) {}

    /**
     * Entity actions
     */
    @Post('/')
    @Authorized('article', 'create')
    public async createArticle(@Body() article: Article, @CurrentUser() user: User) {
        await this.articleRepository.save({ ...article, user })

        return null
    }

    @Get('/:id')
    @Authorized('article', 'read')
    public async readArticle(@Param('id') id: number) {
        return this.articleRepository.findOne(id, {
            relations: ['user', 'pictures'],
        })
    }

    @Post('/:id')
    @Authorized('article', 'update')
    public async updateArticle(@Body() article: DeepPartial<Article>) {
        await this.articleRepository.save(article)
    }

    @Delete('/:id')
    @Authorized('article', 'delete')
    public async deleteArticle(@Param('id') id: number) {
        await this.articleRepository.delete(id)
    }

    /**
     * Collection actions
     */
    @Get('/')
    @Authorized('article', 'read-all')
    public async readArticles() {
        return this.articleRepository.find({
            relations: ['user', 'pictures'],
        })
    }

    @Get('/published')
    public async readPublishedArticles() {
        return this.articleRepository.find({
            relations: ['user', 'pictures'],
            where: {
                published: true,
            },
        })
    }
}
