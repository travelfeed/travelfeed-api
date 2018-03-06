import * as express from 'express'
import * as bodyParser from 'body-parser'

// api routes
import routes from './routes'

const port: number = 9001
const app: express.Application = express()

app.use(bodyParser.json())
app.use('/api', routes)

app.listen(port, () => {
    console.log(`server listening at port ${port}`)
})
