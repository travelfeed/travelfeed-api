import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Article } from '../../article/models/article.model'
import { User } from './user.model'

@Entity()
export class UserRole {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        length: 30,
        unique: true
    })
    public role: string

    /***** relations *****/

    @OneToMany(type => User, user => user.userRole)
    public userRole: Array<User>
}
