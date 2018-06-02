import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body } from 'routing-controllers'
import { Country } from './models/country.model'
import { Authorized } from '../../services/authentication'

@Service()
@JsonController('/country')
export class CountryController {
    /**
     * Model repositories
     */
    @InjectRepository(Country) private countryRepository: Repository<Country>

    @Get('/')
    public async readLanguages() {
        return this.countryRepository.find()
    }

    @Post('/')
    @Authorized('country', 'create')
    public async createTranslation(@Body() country: Country) {
        await this.countryRepository.create(country)

        return null
    }

    @Post('/:id')
    @Authorized('country', 'update')
    public async saveTranslation(@Param('id') id: number, @Body() data: DeepPartial<Country>) {
        await this.countryRepository.update(id, data)
    }

    @Delete('/:id')
    @Authorized('country', 'delete')
    public async deleteTranslation(@Param('id') id: number) {
        await this.countryRepository.delete(id)
    }
}
