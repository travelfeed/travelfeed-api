const knex = require('knex')({
    client: 'mysql',
    connection: {
        user: 'root',
        host: 'localhost',
        database: 'travelfeed',
        password: '',
        port: 3306
    }
})

const bookshelf = require('bookshelf')(knex)

bookshelf.plugin('registry')

export default bookshelf
