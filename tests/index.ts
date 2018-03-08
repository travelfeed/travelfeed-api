import test from 'ava'
import * as supertest from 'supertest'
import { server } from '../src/server'

test('GET /', async t => {
    t.plan(1)

    const res = await supertest(server).get('/')

    t.is(res.status, 404)
})

test('GET /api/auth', async t => {
    t.plan(3)

    const res = await supertest(server).get('/api/auth')

    t.is(res.status, 200)
    t.is(res.body.status, 200)
    t.is(res.body.data, 'Hello user!')
})

test('GET /api/auth/signin', async t => {
    t.plan(3)

    const res = await supertest(server).get('/api/auth/signin')

    t.is(res.status, 200)
    t.is(res.body.status, 200)
    t.is(res.body.data, 'Signin!')
})
