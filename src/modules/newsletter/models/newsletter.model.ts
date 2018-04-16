import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from '../../user/models/user.model'

@Entity()
export class Newsletter {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        length: 50
    })
    public subject: string

    @Column('text') public text: string

    @Column('int') public receivers: number

    @Column('date') public date: string

    @Column('int') public action: number

    /***** relations *****/
    @ManyToOne(type => User, user => user.newsletters)
    public user: User
}
