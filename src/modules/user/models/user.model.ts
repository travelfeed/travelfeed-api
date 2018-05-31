import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { UserRole } from './user.role.model'

@Entity()
export class User {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        unique: true,
        nullable: false,
    })
    public email: string

    @Column() public password: string

    @Column({
        select: false,
        nullable: true,
    })
    public hash: string

    @Column({
        type: 'tinyint',
        default: false,
    })
    public active: boolean

    @Column({
        nullable: false,
    })
    public username: string

    @Column({
        nullable: false,
    })
    public firstname: string

    @Column({
        nullable: false,
    })
    public lastname: string

    /***** relations *****/

    @ManyToOne(() => UserRole, {
        nullable: false,
    })
    @JoinColumn({
        name: 'role',
    })
    public role: UserRole
}
