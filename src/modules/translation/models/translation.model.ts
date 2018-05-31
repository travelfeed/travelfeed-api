import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Timestamp,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { TranslationLanguage } from './translation.language.model'
import { TranslationKey } from './translation.key.model'

@Entity()
export class Translation {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        nullable: false,
    })
    public value: string

    @CreateDateColumn() public created: Timestamp

    @UpdateDateColumn() public updated: Timestamp

    /***** relations *****/

    @ManyToOne(() => TranslationLanguage, {
        nullable: false,
    })
    @JoinColumn({
        name: 'lang',
    })
    public lang: TranslationLanguage

    @ManyToOne(() => TranslationKey, {
        nullable: false,
    })
    @JoinColumn({
        name: 'key',
    })
    public key: TranslationKey
}
