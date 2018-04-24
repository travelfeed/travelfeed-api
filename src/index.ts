import 'reflect-metadata'
import { enableLogging } from './logger'
import { initServer } from './server'

if (process.env.NODE_ENV !== 'production') {
    enableLogging()
}

initServer(process.env.PORT || 3000)
