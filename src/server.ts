import chalk from 'chalk'
import { createServer, Server } from 'http'
import { createConnection, Connection } from 'typeorm'
import { logger } from './config/logger'
import { Express } from './config/express'
import { Socket } from './config/socket'

const { info, error } = logger('server')

export async function initServer(port: number | string): Promise<Server> {
    try {
        // init orm connection
        info('initializing orm connection')
        const conn: Connection = await createConnection()

        // init http server
        info('initializing http server')
        const app = createServer(new Express().app)

        // init socket server
        info('initializing socket server')
        const socket = new Socket(app)

        app.listen(port)
        app.on('listening', () => info(`listening on port ${chalk.cyan(port as string)}`))
        app.on('close', () => info('closed successfully. bye!'))
        app.on('error', err => {
            throw new Error(err.message)
        })

        return app
    } catch (err) {
        error(err)
    }
}
