import * as bcrypt from 'bcryptjs';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserReturnDto } from './dtos/user-return.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { FindOptionsDto, FindReturnModelDto } from 'dtos/find.dto';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { UsersServiceInterface } from './interfaces/users.service.interface';

@Injectable()
export class UsersService implements UsersServiceInterface {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>
    ) { }
    findAll(options: FindOptionsDto<UserEntity>): Promise<FindReturnModelDto<UserReturnDto>> {
        throw new Error('Method not implemented.');
    }

    removePassword(user: UserEntity) {
        delete user?.password;
        return user;
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        return await this.repository.findOneBy({ email });
    }

    async delete(id: number): Promise<any> {
        const result = await this.repository.softDelete(id);

        // if (result.affected === 0) throw new Exception({ message: 'Usuário não encontrado' })
        if (result.affected === 0) throw new Error('Usuário não encontrado');

        return result;
    }

    async findOne(id: number): Promise<UserEntity> {
        /**
         * *********** Ainda retornando Password ao buscar ***********
         */
        const user = await this.repository.findOne({ where: { id } });

        if (user) return this.removePassword(user);
        // else throw new Exception({ message: 'Usuário não encontrado', status: 404 });
        else throw new Error('Usuário não encontrado');
    }

    async create(object: CreateUserDto): Promise<UserReturnDto> {
        try {
            /**
             * *********** Ainda retornando Password ao criar ***********
             */
            const password = await bcrypt.hash(object.password, 10);
            return await this.repository.save({ ...object, password });

        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes("Duplicate entry")) {
                // Personalizando a mensagem de erro para duplicidade de email
                // throw new Exception({ message: 'Este email já está em uso', status: 409 });
                throw new Error('Este email já está em uso');

            } else {
                throw error; // Lançar outros erros que possam ocorrer
            }
        }
    }

    async update(id: number, object: UpdateUserDto): Promise<any> {
        const result = await this.repository.update(id, object);

        // if (result.affected === 0) throw new Exception({ message: 'Usuário não encontrado' })
        if (result.affected === 0) throw new Error('Usuário não encontrado');

        return result;
    }

    async changePassword(object: ChangePasswordDto): Promise<any> {
        const { userId } = object;
        const user = await this.repository.findOneBy({ id: userId });
        // if (!user) throw new Exception({ message: 'Usuário não encontrado', status: 404 });
        if (!user) throw new Error('Usuário não encontrado');


        const passwordMatch = await bcrypt.compare(object.oldPassword, user.password);
        if (!passwordMatch) throw new Error('Senha antiga inválida');

        const newHashedPassword = await bcrypt.hash(object.newPassword, 10);
        return await this.repository.update(userId, { password: newHashedPassword });
    }
}
