import bookshelf from '../../../config/bookshelf'
import User from '../../users/models/users.model'

class Auth extends User {
    public signin() {
        return 'signin'
    }

    public register() {
        return 'register'
    }
}

export default bookshelf.model('AuthModel', Auth)
