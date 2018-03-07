import bookshelf from '../../../config/bookshelf'
import User from '../../users/models/users.model'

class Auth extends User {
    signin() {
        return true
    }

    register() {
        return true
    }
}

export default bookshelf.model('Auth', Auth)
