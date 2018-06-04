import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body } from 'routing-controllers'
import { Country } from './models/country.model'
import { Article } from '../article/models/article.model'
import { Authorized } from '../../services/authentication'

@Service()
@JsonController('/country')
export class CountryController {
    /**
     * Model repositories
     */

    @InjectRepository(Country) private countryRepository: Repository<Country>
    @InjectRepository(Article) private articleRepository: Repository<Article>

    /**
     * Entity actions
     */
    @Post('/')
    @Authorized('country', 'create')
    public async createTranslation(@Body() country: Country) {
        await this.countryRepository.create(country)

        return null
    }

    @Post('/:id([0-9]+)')
    @Authorized('country', 'update')
    public async saveTranslation(@Param('id') id: number, @Body() data: DeepPartial<Country>) {
        await this.countryRepository.update(id, data)
    }

    @Delete('/:id([0-9]+)')
    @Authorized('country', 'delete')
    public async deleteTranslation(@Param('id') id: number) {
        await this.countryRepository.delete(id)
    }

    /**
     * Collection actions
     */
    @Get('/')
    public async readCountries() {
        return this.countryRepository.find()
    }

    @Get('/count')
    public async readCountryCount() {
        const entries = await this.countryRepository.find()
        const countries = entries.map(async country => {
            const articles = await this.articleRepository.find({
                relations: ['country'],
                where: {
                    country: country,
                },
            })

            return { ...country, articles: articles.length }
        })

        return Promise.all(countries)
    }
}
