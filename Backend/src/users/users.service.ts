import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) { }

    async findAll(options?: FindManyOptions): Promise<UserEntity[]> {
        return await this.usersRepository.find(options);
    }

    async findOne(id: number): Promise<UserEntity> {
        return await this.usersRepository.findOneBy({ id });
    }

    async create(object: UserEntity): Promise<UserEntity> {
        return await this.usersRepository.save(object);
    }

    async update(id: number, object: Partial<UserEntity>): Promise<any> {
        return await this.usersRepository.update(id, object);
    }

    async remove(id: number): Promise<any> {
        return await this.usersRepository.softDelete(id);
    }

    async restore(id: number): Promise<any> {
        return await this.usersRepository.restore(id);
    }
}
