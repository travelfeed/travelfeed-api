import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'

@Entity()
export class Newsletter {
    /***** columns *****/
    @PrimaryGeneratedColumn() public id: number

    @Column({
        type: 'varchar',
        length: 40,
        unique: true
    })
    public email: string

    @Column({
        type: 'tinyint',
        default: false
    })
    public active: boolean

    @Column({
        select: false,
        type: 'varchar',
        length: 255,
        unique: true
    })
    public hash: string
}
