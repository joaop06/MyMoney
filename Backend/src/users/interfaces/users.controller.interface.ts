import { UserEntity } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserReturnDto } from "../dtos/user-return.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { FindOptionsDto, FindReturnModelDto } from "dtos/find.dto";

export interface UsersControllerInterface {
    delete?(id: string): Promise<any>

    findOne(id: string): Promise<UserReturnDto>

    create(object: CreateUserDto): Promise<UserReturnDto>

    changePassword(object: ChangePasswordDto): Promise<any>

    update(id: string, object: Partial<UserEntity>): Promise<any>
}