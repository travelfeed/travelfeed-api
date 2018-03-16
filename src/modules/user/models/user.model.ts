import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { Article } from '../../article/models/article.model'
import { UserRole } from './userRole'

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

    /***** relations *****/

    @OneToMany(type => Article, article => article.user)
    public articles: Array<Article>

    @ManyToOne(type => UserRole, userRole => userRole.userRole, {
        cascadeInsert: true
    })
    public userRole: UserRole
}
