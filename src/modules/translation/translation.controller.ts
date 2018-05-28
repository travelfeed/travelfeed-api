import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body, OnUndefined } from 'routing-controllers'
import { Translation } from './models/translation.model'
import { TranslationLanguage } from './models/translation.language.model'

@Service()
@JsonController('/translation')
export class TranslationController {
    /**
     * Model repositories
     */
    @InjectRepository(Translation) private translationRepository: Repository<Translation>
    @InjectRepository(TranslationLanguage)
    private translationLanguageRepository: Repository<TranslationLanguage>

    /**
     * Entity actions
     */
    @Post('/')
    @OnUndefined(201)
    public async createTranslation(@Body() translation: Translation) {
        return this.translationRepository.create(translation)
    }

    @Post('/:id')
    @OnUndefined(201)
    public async saveTranslation(@Param('id') id: number, @Body() data: DeepPartial<Translation>) {
        return this.translationRepository.update(id, data)
    }

    @Delete('/:id')
    @OnUndefined(201)
    public async deleteTranslation(@Param('id') id: number) {
        return this.translationRepository.delete(id)
    }

    /**
     * Collection actions
     */
    @Get('/')
    public async readLanguages() {
        return this.translationLanguageRepository.find()
    }

    @Get('/:lang')
    public async readTranslations(@Param('lang') lang: string) {
        return this.translationRepository
            .find({
                relations: ['key', 'lang'],
                where: {
                    lang: await this.translationLanguageRepository.findOne(lang),
                },
            })
            .then(data => {
                return data.reduce(
                    (prev: any, curr) => {
                        return {
                            ...prev,
                            [curr.key.key]: curr.value,
                        }
                    },
                    {
                        skipFormat: true,
                    },
                )
            })
    }
}
