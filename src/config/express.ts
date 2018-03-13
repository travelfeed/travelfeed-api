import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import * as helmet from 'helmet'
import * as passport from 'passport'
import chalk from 'chalk'

// passport strategy
import { JwtStrategy } from '../modules/auth/strategies/jwt.strategy'

// routes
import { AuthRoutes } from '../modules/auth/routes/auth.routes'
import { UserRoutes } from '../modules/users/routes/users.routes'
import { ArticleRoutes } from '../modules/articles/routes/articles.routes'

const log = console.log

export class Express {
    public env: string
    public app: express.Application

    public constructor() {
        this.env = process.env.NODE_ENV || 'development'
        this.app = express()

        this.initConfig()
        this.initRoutes()
    }

    // middleware
    public initConfig() {
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
    public initRoutes() {
        this.app.use('/api/auth', new AuthRoutes().router)
        this.app.use('/api/users', new UserRoutes().router)
        this.app.use('/api/articles', new ArticleRoutes().router)

        // error handling
        this.app.use((err, req, res, next) => {
            log(chalk.red(err.stack))
            res.status(500).json({
                status: 500,
                error: err.stack
            })
        })
    }
}
