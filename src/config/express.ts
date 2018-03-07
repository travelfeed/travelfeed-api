import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import chalk from 'chalk'

// routes
import { AuthRoutes } from '../modules/auth/routes/auth.routes'
import { UserRoutes } from '../modules/users/routes/users.routes'

const log = console.log

export class Express {
    public app: express.Application
    public router: express.Router

    constructor() {
        this.app = express()
        this.router = express.Router()

        this.initConfig()
        this.initRoutes()
    }

    // middleware
    initConfig() {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(morgan('dev'))
    }

    // routes
    initRoutes() {
        this.app.use('/api/auth', new AuthRoutes(this.router).router)
        this.app.use('/api/users', new UserRoutes(this.router).router)

        // error handling
        this.app.use((err, req, res, next) => {
            log(chalk.red(err.stack))
            res.status(500).json({ error: err.stack })
        })
    }
}
