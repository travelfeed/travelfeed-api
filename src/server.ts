import * as express from 'express'
import * as bodyParser from 'body-parser'
import { routes } from './routes'

const port: number = 9001
const app: express.Application = express()

app.use(bodyParser.json())
app.use('/api', routes)
app.use((req: express.Request, res: express.Response) => {
    res.status(500).json({
        status: 500,
        message: 'Internal server error'
    })
})

app.listen(port, () => {
    console.log(`server listening at port ${port}`)
})
