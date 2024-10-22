import { IsNumber, IsString } from "class-validator";

export class ValidUserDto {
    @IsNumber()
    id?: number;

    @IsString()
    email?: string;
}