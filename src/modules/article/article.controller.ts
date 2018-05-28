import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body, OnUndefined } from 'routing-controllers'
import { Article } from './models/article.model'

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
    @OnUndefined(201)
    public async createArticle(@Body() article: Article) {
        await this.articleRepository.save(article)
    }

    @Get('/:id')
    public async readArticle(@Param('id') id: number) {
        return this.articleRepository.findOne(id, {
            relations: ['user', 'pictures'],
        })
    }

    @Post('/:id')
    @OnUndefined(204)
    public async updateArticle(@Body() article: DeepPartial<Article>) {
        await this.articleRepository.save(article)
    }

    @Delete('/:id')
    @OnUndefined(204)
    public async deleteArticle(@Param('id') id: number) {
        await this.articleRepository.delete(id)
    }

    /**
     * Collection actions
     */
    @Get('/')
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
