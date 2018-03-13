import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm'
import { User } from '../../user/models/user.model'
import { ArticleText } from '../../article/models/articleText.model'

@Entity()
export class Language {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column('varchar') public shorthand: string

    @Column('varchar') public lang: string

    /***** relations *****/

    @OneToMany(type => ArticleText, articleText => articleText.language)
    public articleLanguage: Array<ArticleText>
}
