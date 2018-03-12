import bookshelf from '../../../config/bookshelf'
import { User } from '../../users/models/users.model'

export class Article extends bookshelf.Model<Article> {
    public get tableName() {
        return 'articles'
    }

    // relations
    public users() {
        return this.belongsTo(User, 'id')
    }

    // methods
    public async readArticles() {
        return this.fetchAll()
    }

    public async readArticle(articleId: number) {
        return this.where('id', articleId).fetch()
    }
}
