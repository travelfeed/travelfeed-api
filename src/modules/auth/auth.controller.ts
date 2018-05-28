import { Service, Inject } from 'typedi'
import { Repository } from 'typeorm'
import {
    JsonController,
    Get,
    Post,
    Param,
    Body,
    Req,
    UnauthorizedError,
    BadRequestError,
    NotFoundError,
} from 'routing-controllers'
import { v1 as uuidv1 } from 'uuid'
import { User } from '../user/models/user.model'
import { UserRole } from '../user/models/user.role.model'
import { Request } from 'express'
import { Authentication } from '../../services/authentication'
import { Mail, MailConfig } from '../../services/mail'
import { registerMetadata } from './templates/config.template'

@Service()
@JsonController('/auth')
export class AuthController {
    @Inject() private authentication: Authentication

    @Inject() private mail: Mail

    public constructor(
        private userRepository: Repository<User>,
        private userRoleRepository: Repository<UserRole>,
    ) {}

    @Post('/signin')
    public async signin(@Body() body: any) {
        const user: User = await this.userRepository.findOne({
            relations: ['role'],
            where: {
                email: body.email,
                active: true,
            },
        })

        // user found
        if (!user || !user.id) {
            throw new UnauthorizedError('Wrong email or password')
        }

        if (!(await this.authentication.verifyPassword(body.password, user.password))) {
            throw new UnauthorizedError('Wrong email or password')
        }

        // create jwt
        const tokens = this.authentication.createTokenPair(user.id)

        return {
            userId: user.id,
            userRole: user.role.name,
            authToken: tokens.auth,
            refreshToken: tokens.refresh,
        }
    }

    @Post('/refresh')
    public async refresh(@Body() body: any) {
        if (!this.authentication.validRefreshToken(body.refreshToken, body.userId)) {
            throw new UnauthorizedError('Not authorized.')
        }

        const tokens = this.authentication.createTokenPair(body.userId)

        return {
            authToken: tokens.auth,
            refreshToken: tokens.refresh,
        }
    }

    @Post('/signout')
    public async signout(@Req() req: Request) {
        req.logout()
    }

    @Post('/register')
    public async register(@Body() body: any) {
        const user: User = await this.userRepository.findOne({
            where: {
                email: body.email,
            },
        })

        // email is not taken
        if (user) {
            throw new BadRequestError('This email is already taken.')
        }

        // account activation hash
        const uuidHash = this.authentication.hashString(uuidv1())

        // create new user instance
        const newUser: User = this.userRepository.create({
            email: body.email,
            password: await this.authentication.hashPassword(body.password),
            active: false,
            hash: uuidHash,
            role: await this.userRoleRepository.findOne({
                where: {
                    name: 'user',
                },
            }),
        })

        // save new user
        await this.userRepository.save(newUser)

        // params for html template
        const mailParams = {
            confirmUrl: `https://travelfeed.blog/auth/activate/${uuidHash}`,
        }

        // html template
        const mailText = await this.mail.renderMailTemplate(
            './dist/modules/auth/templates/register.template.html',
            mailParams,
        )

        const mail: MailConfig = {
            from: registerMetadata.from,
            to: newUser.email,
            subject: registerMetadata.subject,
            html: mailText,
        }

        // send mail to user
        await this.mail.sendMail(mail)
    }

    @Get('/activate/:uuid')
    public async activate(@Param('uuid') uuid: string) {
        const user: User = await this.userRepository.findOne({
            where: {
                hash: uuid || null,
                active: false,
            },
        })

        if (!user || !user.email) {
            throw new NotFoundError('User not found')
        }

        user.active = true
        user.hash = null

        await this.userRepository.save(user)
    }

    @Get('/resend/:email')
    public async resend(@Param('email') email: string) {
        const user: User = await this.userRepository.findOne({
            where: {
                email: email,
                active: false,
            },
        })

        if (!user || !user.email) {
            throw new NotFoundError('User not found')
        }

        const uuidHash = this.authentication.hashString(uuidv1()) // account activation mail

        // assign new hash to user
        user.hash = uuidHash
        this.userRepository.save(user)

        // params for html template
        const mailParams = {
            confirmUrl: `https://travelfeed.blog/auth/activate/${uuidHash}`,
        }

        // html template
        const mailText = await this.mail.renderMailTemplate(
            './dist/modules/auth/templates/register.template.html',
            mailParams,
        )

        const mail: MailConfig = {
            from: registerMetadata.from,
            to: user.email,
            subject: registerMetadata.subject,
            html: mailText,
        }

        // send mail to user
        await this.mail.sendMail(mail)
    }
}
