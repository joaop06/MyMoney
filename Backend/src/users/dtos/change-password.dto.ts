import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsNumber()
    @ApiProperty({ required: true, example: 1 })
    @IsNotEmpty({ message: 'Usuário não informado' })
    userId: number;

    @IsString()
    @ApiProperty({ required: true, example: '123456' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    oldPassword: string;

    @IsString()
    @ApiProperty({ required: true, example: '123456@' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    newPassword: string;
}