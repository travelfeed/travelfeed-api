import bookshelf from '../../../config/bookshelf'
import { User } from '../../users/models/users.model'

export class Auth extends User {
    public signin() {
        return 'signin'
    }

    public register() {
        return 'register'
    }
}
