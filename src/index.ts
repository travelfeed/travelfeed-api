import 'reflect-metadata'
import { Container } from 'typedi'
import { useContainer as useContainerTypeorm, createConnection } from 'typeorm'
import { useContainer as useContainerControllers } from 'routing-controllers'
import { Server } from './server'

// enable di on 3rd party libraries
useContainerTypeorm(Container)
useContainerControllers(Container)

// try fetching port from env
const port = parseInt(process.env.PORT, 10) || 3000

// connect to database and start listening
createConnection()
    .then(() => Container.get(Server))
    .then(server => server.prepare().listen(port))
    .catch(error => console.error(error))
