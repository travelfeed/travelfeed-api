import * as http from 'http'
import chalk from 'chalk'
import { Express } from './config/express'

const log = console.log
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

export { app as server }
