import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Timestamp,
    ManyToOne,
} from 'typeorm'
import { MailAction } from './mail.action.model'
import { User } from '../../user/models/user.model'

@Entity()
export class MailHistory {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column() public endpoint: string

    @Column() public subject: string

    @Column('text') public text: string

    @CreateDateColumn() public date: Timestamp

    /***** relations *****/
    @ManyToOne(() => User, user => user.mailHistory)
    public user: User

    @ManyToOne(() => MailAction, mailAction => mailAction.mailHistory)
    public mailAction: MailAction
}
