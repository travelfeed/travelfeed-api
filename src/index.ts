import 'reflect-metadata'
import { enableLogging } from './config/debug'
import { server } from './server'

if (process.env.NODE_ENV !== 'production') {
    enableLogging()
}

server(process.env.PORT || 3000)
