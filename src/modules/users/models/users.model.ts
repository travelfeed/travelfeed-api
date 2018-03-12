import bookshelf from '../../../config/bookshelf'
import { Article } from '../../articles/models/articles.model'

export class User extends bookshelf.Model<User> {
    public get tableName() {
        return 'users'
    }

    // relations
    public articles() {
        return this.hasMany(Article, 'author_id')
    }

    // methods
    public readUsers() {
        return this.fetchAll()
    }

    public readUser(userId: number) {
        return this.where('id', userId).fetch()
    }

    public readUserArticles(userId: number) {
        return this.where('id', userId).fetch({ withRelated: ['articles'] })
    }
}
