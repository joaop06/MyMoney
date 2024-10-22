import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail({}, { message: 'E-mail inválido' })
    @ApiProperty({ required: true, example: 'joao@silva.com' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Nome não informado' })
    @ApiProperty({ required: true, example: 'João Silva' })
    name: string;

    @IsString()
    @ApiProperty({ required: true, example: '123456' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string;
}