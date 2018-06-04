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
import { TranslationKey } from './translation.key.model'
import { Language } from '../../language/models/language.model'

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

    @ManyToOne(() => Language, {
        nullable: false,
    })
    @JoinColumn({
        name: 'lang',
    })
    public lang: Language

    @ManyToOne(() => TranslationKey, {
        nullable: false,
    })
    @JoinColumn({
        name: 'key',
    })
    public key: TranslationKey
}
