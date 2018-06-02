import { Service } from 'typedi'
import { Repository, DeepPartial } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { JsonController, Get, Post, Delete, Param, Body } from 'routing-controllers'
import { Authorized } from '../../services/authentication'
import { User } from './models/user.model'

@Service()
@JsonController('/user')
export class UserController {
    /**
     * Model repositories
     */
    @InjectRepository(User) private userRepository: Repository<User>

    @Get('/')
    @Authorized('user', 'read-all')
    public async readUsers() {
        return this.userRepository.find({
            select: ['id', 'email', 'username', 'firstname', 'lastname', 'role', 'active'],
            relations: ['role'],
        })
    }

    @Post('/')
    @Authorized('user', 'create')
    public async createUser(@Body() user: User) {
        await this.userRepository.create(user)

        return null
    }

    @Get('/:id')
    @Authorized('user', 'read')
    public async readUser(@Param('id') id: number) {
        return this.userRepository.findOne(id, {
            select: ['id', 'email', 'username', 'firstname', 'lastname', 'role', 'active'],
            relations: ['role'],
        })
    }

    @Post('/:id')
    @Authorized('user', 'update')
    public async saveUser(@Param('id') id: number, @Body() data: DeepPartial<User>) {
        await this.userRepository.update(id, data)
    }

    @Delete('/:id')
    @Authorized('user', 'delete')
    public async deleteUser(@Param('id') id: number) {
        await this.userRepository.delete(id)
    }
}
