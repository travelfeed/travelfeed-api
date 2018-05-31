import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { Article } from '../../article/models/article.model'

@Entity()
export class Picture {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column() public link: string

    @Column() public title: string

    @Column() public alt: string

    /***** relations *****/

    @ManyToMany(() => Article, article => article.pictures)
    public articles: Array<Article>
}
