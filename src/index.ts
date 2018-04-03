import 'reflect-metadata'
import { enableLogging } from './config/logger'
import { initServer } from './server'

if (process.env.NODE_ENV !== 'production') {
    enableLogging()
}

initServer(process.env.PORT || 3000)
