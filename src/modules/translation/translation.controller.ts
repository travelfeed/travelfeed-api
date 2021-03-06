import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body } from 'routing-controllers'
import { Authorized } from '../../services/authentication'
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
    @Authorized('translation', 'create')
    public async createTranslation(@Body() translation: Translation) {
        await this.translationRepository.create(translation)

        return null
    }

    @Post('/:id')
    @Authorized('translation', 'update')
    public async saveTranslation(@Param('id') id: number, @Body() data: DeepPartial<Translation>) {
        await this.translationRepository.update(id, data)
    }

    @Delete('/:id')
    @Authorized('translation', 'delete')
    public async deleteTranslation(@Param('id') id: number) {
        await this.translationRepository.delete(id)
    }

    /**
     * Collection actions
     */
    @Get('/')
    @Authorized('translation', 'read-languages')
    public async readLanguages() {
        return this.translationLanguageRepository.find()
    }

    @Get('/keys/:lang')
    @Authorized('translation', 'read-keys')
    public async readTranslationKeys(@Param('lang') lang: string) {
        return this.translationRepository.find({
            relations: ['key', 'lang'],
            where: {
                lang: await this.translationLanguageRepository.findOne(lang),
            },
        })
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
