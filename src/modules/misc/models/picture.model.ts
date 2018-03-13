import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from '../../user/models/user.model'
import { Article } from '../../article/models/article.model'

@Entity()
export class Picture {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column('varchar') public link: string

    @Column('varchar') public title: string

    @Column('varchar') public alt: string

    /***** relations *****/

    @ManyToOne(type => Article, article => article.pictures)
    public article: Article
}
