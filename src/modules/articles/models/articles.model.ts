import bookshelf from '../../../config/bookshelf'
import UserModel from '../../users/models/users.model'

class Article extends bookshelf.Model {
    tableName() {
        return 'articles'
    }

    // relations
    users() {
        return this.belongsTo('UserModel', 'id')
    }

    // methods
    public async readArticles() {
        return await this.fetch()
    }

    public async readArticle(id: number) {
        return await this.where('id', id).fetch()
    }
}

export default bookshelf.model('ArticleModel', Article)
