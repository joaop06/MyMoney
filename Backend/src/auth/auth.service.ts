import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { ValidUserDto } from './dtos/valid-user.dto';
import { UsersService } from 'src/users/users.service';
import { ValidatedLoginDto } from './dtos/validated-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(object: LoginDto): Promise<ValidUserDto> {
        const { email, password } = object;
        const user = await this.usersService.findOneByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: ValidUserDto): Promise<ValidatedLoginDto> {
        const payload = { email: user.email, sub: user.id };

        return {
            message: 'Login realizado com sucesso!',
            accessToken: this.jwtService.sign(payload)
        };
    }
}
