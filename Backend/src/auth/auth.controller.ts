import { LoginDoc } from './doc/login.doc';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { Public } from './jwt/jwt-auth-guard';
import { Post, Body, Controller } from '@nestjs/common';
import { ValidatedLoginDto } from './dtos/validated-login.dto';
import { DynamicException } from 'interceptors/dynamic-exception';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('login')
    @ApiBody(LoginDoc.body)
    @ApiOperation(LoginDoc.operation)
    @ApiOkResponse(LoginDoc.okResponse)
    @ApiUnauthorizedResponse(LoginDoc.unauthorized)
    async login(@Body() object: LoginDto): Promise<ValidatedLoginDto> {
        try {
            const user = await this.authService.validateUser(object);

            if (!user) throw new Error('Credenciais inválidas');

            return await this.authService.login(user);

        } catch (e) {
            new DynamicException(e, 'Authentication', 'pt');
        }
    }
}
