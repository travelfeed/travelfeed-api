import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body, OnUndefined } from 'routing-controllers'
import { Country } from './models/country.model'

@Service()
@JsonController('/country')
export class CountryController {
    /**
     * Model repositories
     */

    @InjectRepository(Country) private countryRepository: Repository<Country>

    /**
     * Entity actions
     */
    @Post('/')
    @OnUndefined(201)
    public async createTranslation(@Body() country: Country) {
        return this.countryRepository.create(country)
    }

    @Post('/:id')
    @OnUndefined(201)
    public async saveTranslation(@Param('id') id: number, @Body() data: DeepPartial<Country>) {
        return this.countryRepository.update(id, data)
    }

    @Delete('/:id')
    @OnUndefined(201)
    public async deleteTranslation(@Param('id') id: number) {
        return this.countryRepository.delete(id)
    }

    /**
     * Collection actions
     */
    @Get('/')
    public async readLanguages() {
        return this.countryRepository.find()
    }
}
