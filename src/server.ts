import { Service, Inject } from 'typedi'
import { useExpressServer, Action } from 'routing-controllers'
import * as express from 'express'
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as cors from 'cors'
import { Logger } from './services/logger'
import { Authentication } from './services/authentication'

@Service()
export class Server {
    /**
     * Logger service.
     *
     * @param {Logger} logger
     */
    @Inject() private logger: Logger

    /**
     * Authentication service.
     *
     * @param {Authentication} authentication
     */
    @Inject() private authentication: Authentication

    /**
     * Express server instance.
     *
     * @param {express.Application} app
     */
    private app: express.Application

    /**
     * Cors options for security.
     *
     * @param {cors.CorsOptions} corsOptions
     */
    private corsOptions: cors.CorsOptions = {
        origin: ['http://localhost:4200'],
    }

    /**
     * Configures the express server instance.
     *
     * @returns {Server}
     */
    public prepare(): Server {
        this.app = express()
        this.app.options('*', cors(this.corsOptions))
        this.app.use(cors(this.corsOptions))
        this.app.use(compression())
        this.app.use(helmet())
        this.app.use(
            morgan((tokens, req, res) => {
                const zerofy = (value: number): string => `0${value}`.slice(-2)
                const date = new Date()
                const hours = zerofy(date.getHours())
                const minutes = zerofy(date.getMinutes())
                const seconds = zerofy(date.getSeconds())
                const sections = [
                    `[http/${hours}:${minutes}:${seconds}]:`,
                    tokens.method(req, res),
                    tokens.url(req, res),
                    tokens.status(req, res),
                    '-',
                    tokens['response-time'](req, res),
                    'ms',
                ]

                return sections.join(' ')
            }),
        )

        this.authentication.prepare()

        this.app = useExpressServer(this.app, {
            controllers: [`${__dirname}/modules/*/*.controller.js`],
            middlewares: [`${__dirname}/**/*.middleware.js`],
            interceptors: [`${__dirname}/**/*.interceptor.js`],
            routePrefix: '/api',
            cors: this.corsOptions,
            currentUserChecker: (action: Action) => action.request.user,
        })

        return this
    }

    /**
     * Starts listening on the given port.
     *
     * @param {number} port
     * @returns {Promise<void>}
     */
    public async listen(port: number): Promise<void> {
        this.app.listen(port)
        this.logger.info(`server is listening on port {${port}}`)
    }
}
