import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { User } from '../../user/models/user.model'
import { Article } from './article.model'

@Entity()
export class ArticleComment {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column('text') public text: string

    @Column('date') public date: string

    @Column({
        type: 'tinyint',
        default: true
    })
    public show: boolean

    /***** relations *****/

    @ManyToOne(type => User, user => user.articles)
    public user: User

    @ManyToOne(type => Article, article => article.comments)
    public article: ArticleComment
}
