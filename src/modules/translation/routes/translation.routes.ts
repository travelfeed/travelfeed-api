import { Router } from 'express'
import { TranslationHandler } from '../handlers/translation.handler'
import { isAuthorized, checkUserRole } from '../../../config/auth'

export class TranslationRoutes {
    public router: Router
    private translationHandler: TranslationHandler

    public constructor() {
        this.router = Router()
        this.translationHandler = new TranslationHandler()

        this.initTranslationsRoutes()
    }

    private initTranslationsRoutes() {
        /**
         * GET / => readLanguages
         */
        this.router.get('/', this.translationHandler.readLanguages)

        /**
         * GET /:lang => readTranslations
         */
        this.router.get('/:lang', this.translationHandler.readTranslations)

        /**
         * POST /:id => saveTranslation
         */
        this.router.post(
            '/:id',
            isAuthorized(),
            checkUserRole('translation', 'update'),
            this.translationHandler.saveTranslation
        )

        /**
         * DELETE /:id => deleteTranslation
         */
        this.router.delete(
            '/:id',
            isAuthorized(),
            checkUserRole('translation', 'delete'),
            this.translationHandler.deleteTranslation
        )

        /***** Translation CRUD *****/
    }
}
