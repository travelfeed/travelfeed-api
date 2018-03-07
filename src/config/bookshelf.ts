const knex = require('knex')({
  client: 'mysql',
  connection : {
    user: '',
    host: '',
    database: '',
    password: '',
    port: '',  }
})

const bookshelf = require('bookshelf')(knex)

bookshelf.plugin('registry');

export default bookshelf;