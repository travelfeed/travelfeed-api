import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { Article } from '../../article/models/article.model'
import { UserRole } from './user.role.model'
import { ArticleComment } from '../../article/models/article.comment.model'
import { MailHistory } from '../../misc/models/mail.history.model'

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

    /***** relations *****/
    @OneToMany(type => Article, article => article.user)
    public articles: Array<Article>

    @OneToMany(type => ArticleComment, articleComment => articleComment.user)
    public comments: Array<Comment>

    @OneToMany(type => MailHistory, mailHistory => mailHistory.user)
    public mailHistory: Array<MailHistory>

    @ManyToOne(type => UserRole, userRole => userRole.userRole)
    public userRole: UserRole
}
