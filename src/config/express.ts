import { join } from 'path'
import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import * as helmet from 'helmet'
import * as passport from 'passport'
import { logger } from '../logger'

// passport strategy
import { JwtStrategy } from '../modules/auth/strategies/jwt.strategy'

// routes
import { AuthRoutes } from '../modules/auth/routes/auth.routes'
import { UserRoutes } from '../modules/user/routes/user.routes'
import { ArticleRoutes } from '../modules/article/routes/article.routes'
import { TranslationRoutes } from '../modules/translation/routes/translation.routes'
import { NewsletterRoutes } from '../modules/newsletter/routes/newsletter.routes'

const { error } = logger('express')

export class Express {
    public root: string
    public env: string
    public app: express.Application

    public constructor(root: string) {
        this.root = root
        this.env = process.env.NODE_ENV || 'development'
        this.app = express()

        this.initConfig()
        this.initRoutes()
    }

    // middleware
    private initConfig(): void {
        const options: cors.CorsOptions = {
            origin: ['http://localhost:4200']
        }

        this.app.options('*', cors(options))
        this.app.use(cors(options))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(morgan('dev'))
        this.app.use(helmet())
        passport.use('strategy.jwt', JwtStrategy)
    }

    // routes
    private initRoutes(): void {
        // api routes
        this.app.use('/api/auth', new AuthRoutes().router)
        this.app.use('/api/user', new UserRoutes().router)
        this.app.use('/api/article', new ArticleRoutes().router)
        this.app.use('/api/translation', new TranslationRoutes().router)
        this.app.use('/api/newsletter', new NewsletterRoutes().router)

        // error handling
        this.app.use((err, req, res, next) => {
            error(err.stack)
            res.status(500).json({
                status: 500,
                error: err.stack
            })
        })

        // serve app
        this.app.use(express.static(join(this.root, 'public')))
        this.app.get('*', (req: express.Request, res: express.Response) => {
            res.sendFile(join(this.root, 'public', 'index.html'))
        })
    }
}
