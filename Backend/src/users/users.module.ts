import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';

@Module({
    exports: [UsersService],
    providers: [UsersService],
    controllers: [UsersController],
    imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule { }
