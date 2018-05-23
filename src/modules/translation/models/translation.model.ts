// tslint:disable-next-line:max-line-length
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Timestamp,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { TranslationLanguage } from './translation.language.model'
import { TranslationKey } from './transaltion.key.model'

@Entity()
export class Translation {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        nullable: false
    })
    public value: string

    @CreateDateColumn() public created: Timestamp

    @UpdateDateColumn() public updated: Timestamp

    /***** relations *****/

    @ManyToOne(type => TranslationLanguage, {
        nullable: false
    })
    @JoinColumn({
        name: 'lang'
    })
    public lang: TranslationLanguage

    @ManyToOne(type => TranslationKey, {
        nullable: false
    })
    @JoinColumn({
        name: 'key'
    })
    public key: TranslationKey
}
