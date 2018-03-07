import test from 'ava'
import * as supertest from 'supertest'
import { server } from '../src/server'

test('GET /', async t => {
    t.plan(3)

    const res = await supertest(server).get('/')

    t.is(res.status, 500)
    t.is(res.body.status, 500)
    t.is(res.body.message, 'Internal server error')
})
