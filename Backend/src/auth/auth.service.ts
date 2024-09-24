import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };

        return { accessToken: this.jwtService.sign(payload) };
    }

    async register(userData: any) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return await this.usersService.create({ ...userData, password: hashedPassword });
    }

    async changePassword(userId: number, changePasswordDto: { oldPassword: string; newPassword: string }) {
        const user = await this.usersService.findOne(userId);

        const passwordMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
        if (!passwordMatch) throw new Error('Invalid old password');

        const newHashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        return await this.usersService.updatePassword(userId, newHashedPassword);
    }
}
