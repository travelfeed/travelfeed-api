import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../../users/models/users.model'

@Entity()
export class Article {
    @PrimaryGeneratedColumn() public id: number

    @Column('text') public title: string

    @Column('text') public text: string

    @ManyToOne(type => User, user => user.articles)
    @JoinColumn()
    public author: User
}
