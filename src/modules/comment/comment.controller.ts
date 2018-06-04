import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body, CurrentUser } from 'routing-controllers'
import { Authorized } from '../../services/authentication'
import { Comment } from './models/comment.model'
import { Article } from '../article/models/article.model'
import { User } from '../user/models/user.model'

@Service()
@JsonController('/comment/:article([0-9]+)')
export class CommentController {
    /**
     * Model repositories
     */
    @InjectRepository(Comment) private commentRepository: Repository<Comment>
    @InjectRepository(Article) private articleRepository: Repository<Article>

    /**
     * Entity actions
     */
    @Post('/')
    @Authorized('comment', 'create')
    public async createComment(
        @CurrentUser() user: User,
        @Param('article') article: number,
        @Body() data: Partial<Comment>,
    ) {
        return this.commentRepository.save({
            user: user,
            article: await this.articleRepository.findOne(article),
            text: data.text,
        })
    }

    @Post('/:id([0-9]+)')
    @Authorized('comment', 'update')
    public async updateComment(
        @Param('article') article: number,
        @Param('id') id: number,
        @Body() comment: DeepPartial<Comment>,
    ) {
        console.log('==>', article, id, comment)
        return this.commentRepository.update(id, comment)
    }

    @Delete('/:id([0-9]+)')
    @Authorized('comment', 'delete')
    public async deleteComment(@Param('article') article: number, @Param('id') id: number) {
        console.log('==>', article, id)
        return this.commentRepository.delete(id)
    }

    /**
     * Collection actions
     */
    @Get('/')
    @Authorized('comment', 'read')
    public async readComments(@Param('article') article: number) {
        console.log('==>', article)
        return this.commentRepository.find({
            relations: ['user', 'article'],
        })
    }

    @Get('/visible')
    public async readVisibleComments(@Param('article') article: number) {
        return this.commentRepository.find({
            relations: ['user'],
            where: {
                article: article,
                visible: true,
            },
        })
    }
}
