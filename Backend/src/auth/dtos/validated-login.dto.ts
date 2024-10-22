import { IsString } from "class-validator";

export class ValidatedLoginDto {
    @IsString()
    message: string;

    @IsString()
    accessToken?: string;
}