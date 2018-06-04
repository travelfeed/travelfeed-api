import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import {
    JsonController,
    Get,
    Post,
    Delete,
    Param,
    Body,
    CurrentUser,
    QueryParam,
} from 'routing-controllers'
import * as readingTime from 'reading-time'
import { Authorized } from '../../services/authentication'
import { Article } from './models/article.model'
import { User } from '../user/models/user.model'

@Service()
@JsonController('/article')
export class ArticleController {
    /**
     * Model repositories
     */
    @InjectRepository(Article) private articleRepository: Repository<Article>

    /**
     * Entity actions
     */
    @Post('/')
    @Authorized('article', 'create')
    public async createArticle(@Body() article: Article, @CurrentUser() user: User) {
        if (article.text && article.text.length > 0) {
            article.readingtime = readingTime(article.text).minutes.toFixed(2)
        }

        await this.articleRepository.save({ ...article, user })

        return null
    }

    @Get('/:id([0-9]+)')
    public async readArticle(@Param('id') id: number) {
        return this.articleRepository.findOne(id, {
            relations: ['user', 'pictures', 'country'],
        })
    }

    @Post('/:id([0-9]+)')
    @Authorized('article', 'update')
    public async updateArticle(@Body() article: DeepPartial<Article>) {
        if (article.text && article.text.length > 0) {
            article.readingtime = readingTime(article.text).minutes.toFixed(2)
        }

        await this.articleRepository.save(article)
    }

    @Delete('/:id([0-9]+)')
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
            relations: ['user', 'pictures', 'country'],
        })
    }

    @Get('/newest')
    public async readNewestArticles(
        @QueryParam('order', {
            required: false,
        })
        order: string = 'ASC',
        @QueryParam('limit', {
            required: false,
        })
        limit: number = 0,
    ) {
        return this.articleRepository.find({
            relations: ['user', 'country'],
            where: {
                published: true,
            },
            order: {
                created: order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
            },
            take: limit > 0 ? limit : undefined,
        })
    }

    @Get('/best-rated')
    public async readBestRatedArticles(
        @QueryParam('order', {
            required: false,
        })
        order: string = 'DESC',
        @QueryParam('limit', {
            required: false,
        })
        limit: number = 0,
    ) {
        return this.articleRepository.find({
            relations: ['user', 'country'],
            where: {
                published: true,
            },
            order: {
                peaces: order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
            },
            take: limit > 0 ? limit : undefined,
        })
    }
}
