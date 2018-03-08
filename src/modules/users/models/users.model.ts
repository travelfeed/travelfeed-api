import bookshelf from '../../../config/bookshelf'
import ArticleModel from '../../articles/models/articles.model'

class User extends bookshelf.Model {
    tableName() {
        return 'users'
    }

    // relations
    articles() {
        return this.hasMany('ArticleModel', 'author_id')
    }

    // methods
    public async readUsers() {
        return await this.fetch()
    }

    public async readUser(userId: number) {
        return await this.where('id', userId).fetch()
    }

    public async readUserArticles(userId: number) {
        return await this.where('id', userId).fetch({ withRelated: ['articles'] })
    }
}

export default bookshelf.model('UserModel', User)
