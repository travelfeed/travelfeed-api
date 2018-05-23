import { Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'
import { bind } from 'decko'
import { TranslationLanguage } from '../models/translation.language.model'
import { Translation } from '../models/translation.model'

export class TranslationHandler {
    private translationLanguageRepo: Repository<TranslationLanguage> = getManager().getRepository(
        TranslationLanguage
    )

    private translationRepo: Repository<Translation> = getManager().getRepository(Translation)

    @bind
    public async readLanguages(req: Request, res: Response): Promise<void> {
        try {
            const languages = await this.translationLanguageRepo.find()

            res.status(200).json({
                status: 200,
                data: languages
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 500,
                data: error
            })
        }
    }

    @bind
    public async readTranslations(req: Request, res: Response): Promise<void> {
        try {
            let translations = await this.translationRepo.find({
                relations: ['lang', 'key']
            })

            translations = translations.filter(item => item.lang.id === req.params.lang)

            res.json({
                status: 200,
                data: translations
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 500,
                data: error
            })
        }
    }

    @bind
    public async saveTranslation(req: Request, res: Response): Promise<void> {
        try {
            await this.translationRepo.updateById(req.params.id, {
                value: req.body.value
            })

            res.status(204).send()
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 500,
                data: error
            })
        }
    }

    @bind
    public async deleteTranslation(req: Request, res: Response): Promise<void> {
        try {
            await this.translationRepo.deleteById(req.params.id)

            res.status(204).send()
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 500,
                data: error
            })
        }
    }
}
