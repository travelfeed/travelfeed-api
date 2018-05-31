import { Service, Inject } from 'typedi'
import { useExpressServer, Action } from 'routing-controllers'
import { useSocketServer } from 'socket-controllers'
import { createServer } from 'http'
import * as express from 'express'
import * as io from 'socket.io'
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
     * Socket server instance.
     *
     * @param {io.Server} io
     */
    private io: io.Server

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

        // prepare jwt auth
        this.authentication.prepare()

        // init socket server
        this.io = io(createServer(this.app), {
            origins: 'localhost:*',
        })
        this.io.on('connect', (socket: io.Socket) => {
            this.logger.debug(`user connected (#${socket.id})`)

            socket.on('message', event => {
                this.logger.silly('message', event)
            })

            socket.on('custom', event => {
                this.logger.silly('custom', event)
            })

            socket.on('disconnect', () => {
                this.logger.debug(`user disconnected (#${socket.id})`)
            })
        })

        // init socket controllers
        useSocketServer(this.io, {
            controllers: [`${__dirname}/modules/*/*.controller.js`],
        })

        // init routing controllers
        useExpressServer(this.app, {
            controllers: [`${__dirname}/modules/*/*.controller.js`],
            middlewares: [`${__dirname}/**/*.middleware.js`],
            interceptors: [`${__dirname}/**/*.interceptor.js`],
            routePrefix: '/api',
            cors: this.corsOptions,
            defaults: {
                nullResultCode: 201,
                undefinedResultCode: 204,
                paramOptions: {
                    required: true,
                },
            },
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
        this.app.on('listening', () => this.logger.info(`listening on port {${port}}`))
        this.app.on('close', () => this.logger.info('closed successfully. bye!'))
        this.app.on('error', error => {
            throw new Error(error.message)
        })

        this.logger.info(`server is listening in ${process.env.NODE_ENV} mode on port {${port}}`)
    }

    /**
     * Returns the express app. (Needed for testing!)
     *
     * @returns {express.Application}
     */
    public get App(): express.Application {
        return this.app
    }
}
