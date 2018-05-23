import { Request, Response, NextFunction } from 'express'
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
    public async readLanguages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const languages = await this.translationLanguageRepo.find()

            res.json({
                status: res.statusCode,
                data: languages
            })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async readTranslations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const translations = await this.translationRepo.find({
                relations: ['lang', 'key'],
                where: {
                    lang: await this.translationLanguageRepo.findOneById(req.params.lang)
                }
            })

            res.json({
                status: res.statusCode,
                data: translations
            })
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async saveTranslation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.translationRepo.updateById(req.params.id, {
                value: req.body.value
            })

            res.status(204).send()
        } catch (err) {
            return next(err)
        }
    }

    @bind
    public async deleteTranslation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.translationRepo.deleteById(req.params.id)

            res.status(204).send()
        } catch (err) {
            return next(err)
        }
    }
}
