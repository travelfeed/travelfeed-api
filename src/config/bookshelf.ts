import * as knex from 'knex'
import * as bookshelf from 'bookshelf'

const knexInstance = knex({
    client: 'mysql',
    connection: {
        user: 'root',
        host: 'localhost',
        database: 'travelfeed',
        password: '',
        port: 3306
    }
})

const bookshelfInstance = bookshelf(knexInstance)

// bookshelfInstance.plugin('registry')

export default bookshelfInstance
