import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserEntity } from './user.entity';

@Module({
    providers: [UsersService],
    controllers: [UsersController],
    imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule { }
