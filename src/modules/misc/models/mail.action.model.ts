import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { MailHistory } from './mail.history.model'

/**
 *      1: NewsletterAll
 *      2: NewsletterSingle
 */

@Entity()
export class MailAction {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        length: 50,
    })
    public action: string

    /***** relations *****/
    @OneToMany(() => MailHistory, mailHistory => mailHistory.mailAction)
    public mailHistory: Array<MailHistory>
}
