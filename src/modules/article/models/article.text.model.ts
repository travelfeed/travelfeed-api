import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Article } from '../../article/models/article.model'
import { Language } from '../../misc/models/language.model'

@Entity()
export class ArticleText {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column('text') public text: string

    /***** relations *****/

    @ManyToOne(type => Article, article => article.articleText)
    public article: Article

    @ManyToOne(type => Language, language => language.articleLanguage)
    public language: Language
}
