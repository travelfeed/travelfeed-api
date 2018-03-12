import bookshelf from '../../../config/bookshelf'
import { User } from '../../users/models/users.model'

export class Auth extends User {
    public readAuthLoginUser(username: string, password: string) {
        return this.where({ username: username, password: password }).fetch()
    }

    public readAuthPayloadUser(id: number, username: string) {
        return this.where({ id: id, username: username }).fetch()
    }

    public signin() {
        return 'signin'
    }

    public register() {
        return 'register'
    }
}
