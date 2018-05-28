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
    OnUndefined,
} from 'routing-controllers'
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
    @OnUndefined(201)
    public async createArticle(@Body() article: Article, @CurrentUser() user: User) {
        await this.articleRepository.save({ ...article, user })
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
    @OnUndefined(204)
    public async updateArticle(@Body() article: DeepPartial<Article>) {
        await this.articleRepository.save(article)
    }

    @Delete('/:id')
    @Authorized('article', 'delete')
    @OnUndefined(204)
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
