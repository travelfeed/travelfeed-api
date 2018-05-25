import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class UserRole {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
    })
    public name: string

    /***** relations *****/
}
