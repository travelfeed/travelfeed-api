import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get } from 'routing-controllers'
import { Language } from './models/language.model'

@Service()
@JsonController('/language')
export class LanguageController {
    /**
     * Model repositories
     */
    @InjectRepository(Language) private languageRepository: Repository<Language>

    /**
     * Collection actions
     */
    @Get('/')
    public async readLanguages() {
        return this.languageRepository.find()
    }
}
