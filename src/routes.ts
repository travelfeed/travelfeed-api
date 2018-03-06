import * as express from 'express'

const routes: express.Router = express.Router()

/**
 * Handles /api
 */
routes.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: 200,
        message: 'API Endpoint'
    })
})

/**
 * Handles /api/hello
 */
routes.get('/hello', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: 200,
        message: 'Hello World!'
    })
})

/**
 * Handles /api/hello/:id
 */
routes.get('/hello/:id', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: 200,
        message: `Hello ${req.params.id}!`
    })
})

export default routes
