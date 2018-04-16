import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { Article } from '../../article/models/article.model'
import { UserRole } from './user.role.model'
import { ArticleComment } from '../../article/models/article.comment.model'
import { Newsletter } from '../../newsletter/models/newsletter.model'

@Entity()
export class User {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        length: 40,
        unique: true
    })
    public email: string

    @Column({
        select: false, // never read password
        type: 'varchar',
        length: 255
    })
    public password: string

    @Column({
        type: 'tinyint',
        default: false
    })
    public active: boolean

    @Column({
        select: false,
        type: 'varchar',
        length: 255
    })
    public hash: string

    @Column({
        type: 'tinyint',
        default: false
    })
    public newsletter: boolean

    /***** relations *****/
    @OneToMany(type => Article, article => article.user)
    public articles: Array<Article>

    @OneToMany(type => ArticleComment, articleComment => articleComment.user)
    public comments: Array<Comment>

    @OneToMany(type => Newsletter, newsletter => newsletter.user)
    public newsletters: Array<Newsletter>

    @ManyToOne(type => UserRole, userRole => userRole.userRole)
    public userRole: UserRole
}
