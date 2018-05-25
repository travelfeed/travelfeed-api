import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Timestamp,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
} from 'typeorm'
import { User } from '../../user/models/user.model'
import { Picture } from '../../picture/models/picture.model'

@Entity()
export class Article {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column() public title: string

    @Column('text') public text: string

    @Column() public city: string

    @Column() public country: string

    @Column() public latitude: string

    @Column() public longitude: string

    @Column() public peaces: string

    @Column() public published: boolean

    @CreateDateColumn() public created: Timestamp

    @UpdateDateColumn() public updated: Timestamp

    /***** relations *****/

    @ManyToOne(() => User, {
        nullable: false,
    })
    @JoinColumn({
        name: 'user',
    })
    public user: User

    @ManyToMany(() => Picture, picture => picture.articles)
    @JoinTable({
        name: 'article_picture',
    })
    public pictures: Array<Picture>
}
