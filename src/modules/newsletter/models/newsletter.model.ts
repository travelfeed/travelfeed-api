import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Newsletter {
    /***** columns *****/
    @PrimaryColumn() public email: string

    @Column({
        type: 'tinyint',
        default: false,
    })
    public active: boolean

    @Column({
        select: false,
        unique: true,
    })
    public hash: string
}
