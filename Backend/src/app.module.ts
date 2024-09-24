import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UserEntity } from './users/user.entity';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      port: 3306,
      type: 'mysql',
      synchronize: true,
      host: '189.90.130.58',
      password: 'Joao55347@',
      entities: [UserEntity],
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      database: 'joaopedro_mymoney',
      username: 'joaopedro_mymoney',
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
