import { Router } from 'express'
import { TranslationsHandler } from '../handler/translations.handler'

export class TranslationsRoutes {
    public router: Router
    private translationsHandler: TranslationsHandler

    public constructor() {
        this.router = Router()
        this.translationsHandler = new TranslationsHandler()

        this.initTranslatiosnRoutes()
    }

    private initTranslatiosnRoutes() {
        this.router.get('/:language', this.translationsHandler.readTranslations)
    }
}
