import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Language } from './language.model'

@Entity()
export class Textk {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        unique: true
    })
    public shorthand: string

    @Column('varchar') public text: string

    /***** relations *****/
    @ManyToOne(type => Language, language => language.textkLanguage)
    public language: Language
}
