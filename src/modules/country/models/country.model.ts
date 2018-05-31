import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Country {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column() public name: string

    @Column() public code: string
}
