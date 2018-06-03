import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body } from 'routing-controllers'
import { Authorized } from '../../services/authentication'
import { Language } from '../language/models/language.model'
import { Translation } from './models/translation.model'
import { TranslationKey } from './models/translation.key.model'

@Service()
@JsonController('/translation')
export class TranslationController {
    /**
     * Model repositories
     */
    @InjectRepository(Language) private languageRepository: Repository<Language>
    @InjectRepository(Translation) private translationRepository: Repository<Translation>
    @InjectRepository(TranslationKey) private translationKeyRepository: Repository<TranslationKey>

    /**
     * Entity actions
     */
    @Post('/:id([0-9]+)')
    @Authorized('translation', 'update')
    public async saveTranslation(@Param('id') id: number, @Body() data: DeepPartial<Translation>) {
        await this.translationRepository.update(id, data)
    }

    @Delete('/:id([0-9]+)')
    @Authorized('translation', 'delete')
    public async deleteTranslation(@Param('id') id: number) {
        await this.translationRepository.delete(id)
    }

    @Post('/keys/create')
    @Authorized('translation', 'create')
    public async createTranslationKey(@Body() data: TranslationKey) {
        const key = await this.translationKeyRepository.save(data)
        const languages = await this.languageRepository.find()

        for (const lang of languages) {
            await this.translationRepository.save({
                key,
                lang,
            })
        }

        return key
    }

    /**
     * Collection actions
     */
    @Get('/:lang')
    public async readTranslations(@Param('lang') lang: string) {
        return this.translationRepository
            .find({
                relations: ['key', 'lang'],
                where: {
                    lang: await this.languageRepository.findOne(lang),
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

    @Get('/keys/:lang')
    @Authorized('translation', 'read-keys')
    public async readTranslationKeys(@Param('lang') lang: string) {
        return this.translationRepository.find({
            relations: ['key', 'lang'],
            where: {
                lang: await this.languageRepository.findOne(lang),
            },
        })
    }
}
