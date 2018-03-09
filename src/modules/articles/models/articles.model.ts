import bookshelf from '../../../config/bookshelf'
import UserModel from '../../users/models/users.model'

class Article extends bookshelf.Model {
    public tableName() {
        return 'articles'
    }

    // relations
    public users() {
        return this.belongsTo('UserModel', 'id')
    }

    // methods
    public async readArticles() {
        return this.fetch()
    }

    public async readArticle(id: number) {
        return this.where('id', id).fetch()
    }
}

export default bookshelf.model('ArticleModel', Article)
