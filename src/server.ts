import chalk from 'chalk'
import { createServer, Server } from 'http'
import { createConnection, Connection } from 'typeorm'
import { logger } from './config/debug'
import { Express } from './config/express'

const log = logger('server')

export async function server(port: number | string): Promise<Server> {
    try {
        const conn: Connection = await createConnection()
        const app = createServer(new Express().app)

        app.listen(port)
        app.on('listening', () => log(`listening on port ${chalk.cyan(port as string)}`))
        app.on('close', () => log('closed successfully. bye!'))
        app.on('error', error => {
            throw new Error(error.message)
        })

        return app
    } catch (error) {
        log(chalk.red(error))
    }
}
