import bookshelf from '../../../config/bookshelf'

class User extends bookshelf.Model {
    tableName() {
        return 'users'
    }
}

export default bookshelf.model('User', User)
