import chalk from 'chalk'
import { createServer, Server } from 'http'
import { createConnection, Connection } from 'typeorm'
import { logger } from './logger'
import { Express } from './config/express'

const { info, error } = logger('server')

export async function initServer(port: number | string): Promise<Server> {
    try {
        info('initializing orm connection')

        const conn: Connection = await createConnection()
        const app = createServer(new Express(__dirname).app)

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
