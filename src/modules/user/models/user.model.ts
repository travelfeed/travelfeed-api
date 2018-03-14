import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Article } from '../../article/models/article.model'

@Entity()
export class User {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        length: 30,
        unique: true
    })
    public username: string

    @Column({
        type: 'varchar',
        length: 40,
        unique: true
    })
    public email: string

    @Column({
        select: false, // never read password
        type: 'varchar',
        length: 50
    })
    public password: string

    /***** relations *****/

    @OneToMany(type => Article, article => article.user)
    public articles: Array<Article>
}
