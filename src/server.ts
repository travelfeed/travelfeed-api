import * as express from 'express'
import * as bodyParser from 'body-parser'
import { routes } from './routes'

const port: number = 9001
const server: express.Application = express()

server.use(bodyParser.text())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded())
server.use('/api', routes)
server.use((req: express.Request, res: express.Response) => {
    res.status(500).json({
        status: 500,
        message: 'Internal server error'
    })
})

server.listen(port, () => {
    console.log(`server listening at port ${port}`)
})

export { server }
