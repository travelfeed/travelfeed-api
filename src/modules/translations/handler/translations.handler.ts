import { Request, Response } from 'express'

export class TranslationsHandler {
    public constructor() {}

    public readTranslations(req: Request, res: Response) {
        res.json({
            status: 200,
            data: req.params.language
        })
    }
}
