import { IsEmail, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'joao@silva.com' })
    @IsEmail({}, { message: 'E-mail inválido' })
    email: string;

    @ApiProperty({ example: '123456' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string;
}