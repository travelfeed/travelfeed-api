import test from 'ava'
import { agent } from 'supertest'
import { server } from '../dist/server'

test('GET /', async t => {
    t.plan(3)

    const res = await agent(await server(3000)).get('/')

    t.is(res.status, 200)
    t.is(res.body.status, 200)
    t.is(res.body.data.message, 'success!')
})
