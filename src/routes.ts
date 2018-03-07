import * as express from 'express'
import { auth } from './auth'

const routes: express.Router = express.Router()

routes.use('/auth', auth)

export { routes }
