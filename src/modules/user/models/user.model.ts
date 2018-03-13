import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm'
import { Article } from '../../article/models/article.model'

@Entity()
export class User {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column('varchar') public username: string

    @Column('varchar') public email: string

    @Column('varchar') public password: string

    /***** relations *****/

    @OneToMany(type => Article, article => article.user)
    public articles: Array<Article>
}
