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
        this.router.get(
            '/subscribe',
            isAuthorized(),
            checkUserRole('newsletter', 'subscribe'),
            this.handler.subNewsletter
        )
        this.router.get(
            '/unsubscribe',
            isAuthorized(),
            checkUserRole('newsletter', 'unsubscribe'),
            this.handler.unsubNewsletter
        )
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
