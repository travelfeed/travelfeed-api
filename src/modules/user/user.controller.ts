import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body, OnUndefined } from 'routing-controllers'
import { Authorized } from '../../services/authentication'
import { User } from './models/user.model'

@Service()
@JsonController('/user')
export class UserController {
    /**
     * Model repositories
     */
    @InjectRepository(User) private userRepository: Repository<User>

    /**
     * Entity actions
     */
    @Post('/')
    @OnUndefined(201)
    public async createUser(@Body() user: User) {
        return this.userRepository.create(user)
    }

    @Get('/:id')
    @Authorized('admin')
    public async readUser(@Param('id') id: number) {
        return this.userRepository.findOne(id, {
            select: ['id', 'email', 'username', 'firstname', 'lastname', 'role', 'active'],
            relations: ['role'],
        })
    }

    @Post('/:id')
    @OnUndefined(201)
    public async saveUser(@Param('id') id: number, @Body() data: DeepPartial<User>) {
        return this.userRepository.update(id, data)
    }

    @Delete('/:id')
    @OnUndefined(201)
    public async deleteUser(@Param('id') id: number) {
        return this.userRepository.delete(id)
    }

    /**
     * Collection actions
     */
    @Get('/')
    public async readUsers() {
        return this.userRepository.find({
            select: ['id', 'email', 'username', 'firstname', 'lastname', 'role', 'active'],
            relations: ['role'],
        })
    }
}
