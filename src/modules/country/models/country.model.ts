import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Timestamp,
    ManyToOne,
    JoinColumn,
} from 'typeorm'

@Entity()
export class Country {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column() public name: string

    @Column() public code: string
}
