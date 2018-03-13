import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, Index } from 'typeorm'
import { Article } from '../../article/models/article.model'

@Entity()
export class User {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Index({ unique: true })
    @Column('varchar')
    public username: string

    @Column('varchar') public email: string

    @Column('varchar') public password: string

    /***** relations *****/

    @OneToMany(type => Article, article => article.user)
    public articles: Array<Article>
}
