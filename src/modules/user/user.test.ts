import test from 'ava'
import { factory } from '../../index.test'

test('POST /user', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().post('/api/user')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})

test('GET /user/1', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().get('/api/user/1')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})

test('POST /user/1', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().post('/api/user/1')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})

test('DELETE /user/1', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().delete('/api/user/1')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})

test('GET /', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().get('/api/user')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})
