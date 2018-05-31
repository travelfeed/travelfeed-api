import 'reflect-metadata'
import { Container } from 'typedi'
import { useContainer as useContainerDatabase, createConnection } from 'typeorm'
import { useContainer as useContainerRouting } from 'routing-controllers'
import { useContainer as useContainerSocket } from 'socket-controllers'
import { Server } from './server'

const port = parseInt(process.env.PORT, 10) || 3000

const devDomain = `http://localhost:${port}`
const prodDomain = 'https://travelfeed.blog'

process.env.DOMAIN = process.env.NODE_ENV === 'development' ? devDomain : prodDomain

// enable di on 3rd party libraries
useContainerDatabase(Container)
useContainerRouting(Container)
useContainerSocket(Container)

// try fetching port from env

// connect to database and start listening
createConnection()
    .then(() => Container.get(Server))
    .then(server => server.prepare().listen(port))
    .catch(error => console.error(error))
