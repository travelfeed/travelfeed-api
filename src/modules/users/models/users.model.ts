import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm'
import { Article } from '../../articles/models/articles.model'

@Entity()
export class User {
    @PrimaryGeneratedColumn() public id: number

    @Column('text') public username: string

    @Column('text') public email: string

    @Column('text') public password: string

    @OneToMany(type => Article, article => article.author)
    @JoinColumn()
    public articles: Array<Article>
}
