import test from 'ava'
import { factory } from '../../index.test'

test('POST /translation', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().post('/api/translation')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})

test('POST /translation/1', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().post('/api/translation/1')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})

test('DELETE /translation/1', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().delete('/api/translation/1')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})

test('GET /translation/keys/de', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().get('/api/translation/keys/de')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})

test('POST /translation/keys', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server().post('/api/translation/keys')

    t.is(response.status, 401)
    t.deepEqual(response.body, {
        error: 'Not authorized.',
        status: 401,
    })
})

test('GET /translation/de', async t => {
    t.plan(1)

    const server = await factory()
    const response = await server().get('/api/translation/de')

    t.is(response.status, 200)
})
