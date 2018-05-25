import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body } from 'routing-controllers'
import { Comment } from './models/comment.model'

@Service()
@JsonController('/comment/:article')
export class CommentController {
    /**
     * Model repositories
     */
    @InjectRepository(Comment) private commentRepository: Repository<Comment>

    /**
     * Entity actions
     */
    @Post('/')
    public async createComment(@Body() comment: Comment) {
        return this.commentRepository.save(comment)
    }

    @Get('/:id')
    public async readComment(@Param('id') id: number) {
        return this.commentRepository.findOne(id, {
            relations: ['user', 'article'],
        })
    }

    @Post('/:id')
    public async updateComment(@Param('id') id: number, @Body() comment: DeepPartial<Comment>) {
        return this.commentRepository.update(id, comment)
    }

    @Delete('/:id')
    public async deleteComment(@Param('id') id: number) {
        return this.commentRepository.delete(id)
    }

    /**
     * Collection actions
     */
    @Get('/')
    public async readComments() {
        return this.commentRepository.find({
            relations: ['user', 'article'],
        })
    }

    @Get('/visible')
    public async readVisibleComments() {
        return this.commentRepository.find({
            relations: ['user', 'article'],
            where: {
                visible: true,
            },
        })
    }
}
