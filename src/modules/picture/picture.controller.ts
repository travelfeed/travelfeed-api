import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body } from 'routing-controllers'
import { Picture } from './models/picture.model'

@Service()
@JsonController('/picture')
export class PictureController {
    /**
     * Model repositories
     */
    @InjectRepository(Picture) private pictureRepository: Repository<Picture>

    @Get('/')
    public async readPictures() {
        return this.pictureRepository.find({
            relations: ['articles'],
        })
    }

    @Post('/')
    public async createPicture(@Body() article: Picture) {
        return this.pictureRepository.save(article)
    }

    @Get('/:id')
    public async readPicture(@Param('id') id: number) {
        return this.pictureRepository.findOne(id, {
            relations: ['articles'],
        })
    }

    @Post('/:id')
    public async updatePicture(@Param('id') id: number, @Body() picture: DeepPartial<Picture>) {
        return this.pictureRepository.update(id, picture)
    }

    @Delete('/:id')
    public async deletePicture(@Param('id') id: number) {
        return this.pictureRepository.delete(id)
    }
}
