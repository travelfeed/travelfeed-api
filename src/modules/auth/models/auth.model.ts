import bookshelf from '../../../config/bookshelf'
import User from '../../users/models/users.model'

class Auth extends User {
    signin() {
        return 'signin'
    }

    register() {
        return 'register'
    }
}

export default bookshelf.model('AuthModel', Auth)
