import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Timestamp,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { User } from '../../user/models/user.model'
import { Article } from '../../article/models/article.model'

@Entity()
export class Comment {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column('text') public text: string

    @CreateDateColumn() public date: Timestamp

    @Column({
        type: 'tinyint',
        default: true, // should be false when the approvement process is integrated
    })
    public visible: boolean

    /***** relations *****/

    @ManyToOne(() => User, {
        nullable: false,
    })
    @JoinColumn({
        name: 'user',
    })
    public user: User

    @ManyToOne(() => Article, {
        nullable: false,
    })
    @JoinColumn({
        name: 'article',
    })
    public article: Article
}
