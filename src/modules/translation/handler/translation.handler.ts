import { Request, Response } from 'express'

export class TranslationHandler {
    public constructor() {}

    public readTranslation(req: Request, res: Response) {
        res.json({
            status: 200,
            data: req.params.language
        })
    }
}
