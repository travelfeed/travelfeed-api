import { Router } from 'express'
import { TranslationHandler } from '../handler/translation.handler'

export class TranslationRoutes {
    public router: Router
    private translationHandler: TranslationHandler

    public constructor() {
        this.router = Router()
        this.translationHandler = new TranslationHandler()

        this.initTranslationsRoutes()
    }

    private initTranslationsRoutes() {
        this.router.get('/:language', this.translationHandler.readTranslation)
    }
}
