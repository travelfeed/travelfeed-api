import bookshelf from '../../../config/bookshelf'
import ArticleModel from '../../articles/models/articles.model'

class User extends bookshelf.Model {
    public tableName() {
        return 'users'
    }

    // relations
    public articles() {
        return this.hasMany('ArticleModel', 'author_id')
    }

    // methods
    public async readUsers() {
        return this.fetch()
    }

    public async readUser(userId: number) {
        return this.where('id', userId).fetch()
    }

    public async readUserArticles(userId: number) {
        return this.where('id', userId).fetch({ withRelated: ['articles'] })
    }
}

export default bookshelf.model('UserModel', User)
