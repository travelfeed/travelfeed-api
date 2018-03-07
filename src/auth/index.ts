import * as express from 'express'

const auth: express.Router = express.Router()

/**
 * Handles /api/auth
 */
auth.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: 200,
        message: 'Auth Endpoint'
    })
})

/**
 * Handles /api/auth/signin
 */
auth.get('/signin', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: 200,
        message: 'Sign in!'
    })
})

export { auth }
