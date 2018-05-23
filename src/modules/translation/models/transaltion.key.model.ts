import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class TranslationKey {
    /***** columns *****/

    @PrimaryColumn({
        nullable: false
    })
    public key: string

    @Column({
        nullable: false
    })
    public default: string

    @Column({
        nullable: true,
        default: null
    })
    public description: string
}
