import 'reflect-metadata'
import test from 'ava'
import * as supertest from 'supertest'
import { Container } from 'typedi'
import { useContainer as useContainerTypeorm, createConnection } from 'typeorm'
import { useContainer as useContainerControllers } from 'routing-controllers'
import { Server } from './server'

/**
 * Mock database connection and prepare server
 */
export async function factory(): Promise<() => supertest.SuperTest<supertest.Test>> {
    useContainerTypeorm(Container)
    useContainerControllers(Container)

    await createConnection()

    return () => supertest(Container.get(Server).prepare().App)
}

test.beforeEach(async () => {
    // setup test context
})
