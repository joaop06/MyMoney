import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { UserEntity } from './users/user.entity';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      port: 3306,
      type: 'mysql',
      username: 'root',
      host: 'localhost',
      database: 'mymoney',
      password: 'Joao55347@',
      entities: [UserEntity],
      synchronize: true
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
