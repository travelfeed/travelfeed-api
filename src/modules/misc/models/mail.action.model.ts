import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { MailHistory } from './mail.history.model'

@Entity()
export class MailAction {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        length: 50
    })
    public desc: string

    /***** relations *****/
    @OneToMany(type => MailHistory, mailHistory => mailHistory.mailAction)
    public mailHistory: Array<MailHistory>
}
