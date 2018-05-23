import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class TranslationLanguage {
    /***** columns *****/

    @PrimaryColumn() public id: string

    @Column() public name: string
}
