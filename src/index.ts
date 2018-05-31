import 'reflect-metadata'
import { Container } from 'typedi'
import { useContainer as useContainerDatabase, createConnection } from 'typeorm'
import { useContainer as useContainerRouting } from 'routing-controllers'
import { useContainer as useContainerSocket } from 'socket-controllers'
import { Server } from './server'

// enable di on 3rd party libraries
useContainerDatabase(Container)
useContainerRouting(Container)
useContainerSocket(Container)

// try fetching port from env
const port = parseInt(process.env.PORT, 10) || 3000

// connect to database and start listening
createConnection()
    .then(() => Container.get(Server))
    .then(server => server.prepare().listen(port))
    .catch(error => console.error(error))
