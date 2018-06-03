import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Language {
    /***** columns *****/

    @PrimaryColumn() public id: string

    @Column() public name: string
}
