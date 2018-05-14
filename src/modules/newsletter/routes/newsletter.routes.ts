import { Router } from 'express'
import { NewsletterHandler } from '../handlers/newsletter.handler'
import { isAuthorized, checkUserRole } from '../../../config/auth'

export class NewsletterRoutes {
    public router: Router
    private handler: NewsletterHandler

    public constructor() {
        this.router = Router()
        this.handler = new NewsletterHandler()
        this.initRoutes()
    }

    private initRoutes() {
        this.router.get('/subscribe/:email', this.handler.subNewsletter)
        this.router.get('/unsubscribe/:uuid', this.handler.unsubNewsletter)
        this.router.get('/activate/:uuid', this.handler.activateNewsletter)
        this.router.post(
            '/send',
            isAuthorized(),
            checkUserRole('newsletter', 'sendAll'),
            this.handler.sendNewsletterAll
        )
        this.router.post(
            '/send/:email',
            isAuthorized(),
            checkUserRole('newsletter', 'sendSingle'),
            this.handler.sendNewsletterSingle
        )
    }
}
