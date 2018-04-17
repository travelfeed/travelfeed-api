import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { MailAction } from './mail.action.model'
import { User } from '../../user/models/user.model'

@Entity()
export class MailHistory {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        length: 255
    })
    public endpoint: string

    @Column({
        type: 'varchar',
        length: 100
    })
    public subject: string

    @Column('text') public text: string

    @Column('date') public date: string

    /***** relations *****/
    @ManyToOne(type => User, user => user.mailHistory)
    public user: User

    @ManyToOne(type => MailAction, mailAction => mailAction.mailHistory)
    public mailAction: MailAction
}
