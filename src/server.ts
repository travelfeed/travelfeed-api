import * as http from 'http'
import chalk from 'chalk'
import { Express } from './config/express'
import { createConnection } from 'typeorm'

const log = console.log

const con_app = new Promise((resolve, reject) => {
    createConnection()
        .then(connection => {
            log(chalk.green(`ORM connection initialized...`))

            const app = new Express().app

            const server = http.createServer(app)
            const port = process.env.PORT || 3000

            server.listen(port)

            server.on('listening', () => {
                log(chalk.green(`Server is listening on port: ${port}`))
            })

            server.on('close', () => {
                log(chalk.yellow(`Server closed`))
            })

            server.on('error', err => {
                log(chalk.red(err.stack))
            })

            resolve(app)
        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
}).catch(err => {
    throw err
})

export { con_app as server }
