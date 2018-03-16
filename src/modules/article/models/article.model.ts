import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { User } from '../../user/models/user.model'
import { ArticleText } from './articleText.model'
import { Picture } from '../../misc/models/picture.model'
import { Language } from '../../misc/models/language.model'

@Entity()
export class Article {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column('varchar') public title: string

    @Column('varchar') public city: string

    @Column('varchar') public country: string

    @Column('varchar') public latitude: string

    @Column('varchar') public longitude: string

    @Column('varchar') public peaces: string

    /***** relations *****/

    @ManyToOne(type => User, user => user.articles)
    public user: User

    @OneToMany(type => ArticleText, articleText => articleText.article)
    public articleText: Array<ArticleText>

    @OneToMany(type => Picture, picture => picture.article)
    public pictures: Array<Picture>
}
