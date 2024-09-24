import { AuthService } from './auth.service';
// import {LocalAuthGuard} from './local-auth.guard';
import { Post, Body, Request, UseGuards, Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: { email: string; password: string }) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            return { message: 'Invalid credentials' };
        }

        return await this.authService.login(user);
    }

    @Post('register')
    async register(@Body() registerDto: { email: string; password: string }) {
        return await this.authService.register(registerDto);
    }

    @Post('change-password')
    // @UseGuards(JwtAuthGuard)
    async changePassword(@Request() req, @Body() changePasswordDto: { oldPassword: string; newPassword: string }) {
        return this.authService.changePassword(req.user.id, changePasswordDto);
    }
}
